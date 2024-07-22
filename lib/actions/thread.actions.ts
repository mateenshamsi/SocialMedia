"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "../mongoose";

import { fetchUsers, getUserFollowersIds } from "./user.actions";
import  User  from "../models/user.models";
import Thread from "../models/thread.models";

export async function fetchExplore({
  userId,
  pageNumber = 1,
  pageSize = 20,
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  try {
 

   
    const skipAmount = (pageNumber - 1) * pageSize;

    const followedUsersIds = await getUserFollowersIds(userId, "following");

    
    const postsQuery = Thread.find({
      author: { $in: followedUsersIds },
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
     
      .populate({
        path: "children", 
        populate: {
          path: "author", 
          model: User,
          select: "_id name parentId image", 
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      author: { $in: followedUsersIds },
      parentId: { $in: [null, undefined] },
    }); 
    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching threads: ${error.message}`);
  }
}

export async function isThreadReactedByUser({
  threadId,
  userId,
}: {
  threadId: string;
  userId: string;
}) {
  try {
  

    const thread = await Thread.findOne({ _id: threadId });

    const isReacted: any = thread.reactions.some((reaction: any) =>
      reaction.user.equals(userId)
    );

    return !!isReacted;
  } catch (error: any) {
    throw new Error(
      `Failed to check if thread is reacted by user: ${error.message}`
    );
  }
}
export async function getReactedUsersByThread(threadId: string) {
  try {
 

    const thread = await Thread.findOne({ _id: threadId });

    const reactedUsersIds = thread.reactions.map(
      (reaction: any) => reaction.user
    );

    const reactedUsers = await fetchUsers({
      userId: "INVALID_USER_ID",
      userIds: reactedUsersIds,
    });

    return reactedUsers;
  } catch (error: any) {
    throw new Error(`Failed to get reacted users: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
 

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
    
      .populate({
        path: "children", 
        populate: {
          path: "author", 
          model: User,
          select: "_id name parentId image", 
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); 
    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching threads: ${error.message}`);
  }
}

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function editThread({
  threadId,
  text,
  path,
}: {
  threadId: string;
  text: string;
  path: string;
}) {
  try {


    const thread = await Thread.findById(threadId);

    if (!thread) {
      throw new Error("Thread not found");
    }

    thread.text = text;

    await thread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to edit thread: ${error.message}`);
  }
}
export async function createThread({
  text,
  author,
 
  path,
}: Params) {
  try {
  
    const createdThread = await Thread.create({
      text,
      author,
     });

   
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

   

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {


  
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

   

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
export async function fetchThreadById(threadId: string) {
  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addReactToThread({
  threadId,
  userId,
  path,
}: {
  threadId: string;
  userId: string;
  path: string;
}) {
  try {
  

    const thread = await Thread.findById(threadId);
    const user = await User.findOne({ id: userId });

    if (!thread) {
      throw new Error("Thread not found");
    }

    const isAlreadyReacted = await isThreadReactedByUser({
      threadId: thread._id,
      userId: user._id,
    });

    if (isAlreadyReacted) {
      thread.reactions.pull({
        user: user._id,
      });
    } else {
      thread.reactions.push({
        user: user._id,
      });
    }

    await thread.save();

    if (isAlreadyReacted) {
      user.reactions.pull({
        thread: thread._id,
      });
    } else {
      user.reactions.push({
        thread: thread._id,
      });
    }

    await user.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add reaction to thread: ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function fetchPostReactions({ threadId }: { threadId: string }) {
  try {
  

    const thread = await Thread.findOne({ id: threadId });

    if (!thread) {
      throw new Error("Thread not found");
    }

    const reactionsUsersIds = thread.reactions.map(
      (reaction: any) => reaction.user
    );

    const reactions = await User.find({
      _id: { $in: reactionsUsersIds },
    }).select("_id id name image username");

    return reactions;
  } catch (error: any) {
    throw new Error(`Failed to fetch post reactions: ${error.message}`);
  }
}

export async function getReactionsData({
  userId,
  posts,
  parentId = "",
}: {
  userId: string;
  posts: any[];
  parentId?: string;
}) {
  try {
  

    const [parentReactions, parentReactionState, childrenData] =
      await Promise.all([
        (parentId && getReactedUsersByThread(parentId)) || [],
        (parentId &&
          isThreadReactedByUser({
            threadId: parentId,
            userId,
          })) ||
          false,
        Promise.all(
          posts.map(async (post) => {
            const reactedUsers = await getReactedUsersByThread(post._id);
            const reactedByUser = await isThreadReactedByUser({
              threadId: post._id,
              userId,
            });
            return { reactedUsers, reactedByUser };
          })
        ),
      ]);

    const childrenReactions = childrenData.map(
      (data: any) => data.reactedUsers
    );
    const childrenReactionState = childrenData.map(
      (data: any) => data.reactedByUser
    );

    return {
      parentReactions,
      parentReactionState,
      childrenReactions,
      childrenReactionState,
    };
  } catch (error: any) {
    throw new Error(`Failed to get reactions data: ${error.message}`);
  }
}