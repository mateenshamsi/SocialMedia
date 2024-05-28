"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.models"
import { connectDB } from "../mongoose"
import Thread from "../models/thread.models"
import { FilterQuery, SortOrder } from "mongoose"
interface Props{ 
    userId:String, 
    username:String ,
    name:string ,
    bio:string, 
    image:string , 
    path:string 
}
export async function followUser({
  followerId,
  followedId,
  path,
}: {
  followerId: string;
  followedId: string;
  path: string;
}) {
  try {
    connectDB();

    const follower = await User.findOne({ id: followerId });

    if (!follower) {
      throw new Error("Follower not found");
    }

    const followed = await User.findOne({ id: followedId });

    if (!followed) {
      throw new Error("Followed not found");
    }

    const isAlreadyFollowed = await isUserFollowing(followerId, followedId);

    if (isAlreadyFollowed) {
      follower.following.pull({
        user: followed._id,
      });
    } else {
      follower.following.push({
        user: followed._id,
      });
    }

    await follower.save();

    if (isAlreadyFollowed) {
      followed.followers.pull({
        user: follower._id,
      });
    } else {
      followed.followers.push({
        user: follower._id,
      });
    }

    await followed.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}
export async function isUserFollowing(followerId:string,followedId:string){ 
  try{ 
    connectDB() 
    const followed = await User.findOne({id:followedId})
    const isFollowing = await User.findOne({id:followerId,following:{$elemMatch:{user:followed._id}}}

    )
    return !!isFollowing 

  }
  catch(err:any)
  { 
    throw new Error("Failed to check if user followed")
  }
}
export async function fetchUser(userId: string) {
  try {
    await connectDB(); // Ensure the database is connected

    return await User.findOne({ id: userId })
    
    .populate({
      path: 'threads',
      model: 'Thread' // Ensure 'Thread' is the correct model name
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Props): Promise<void> {
  try {
    connectDB();

    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
   
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
       
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}


export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectDB();

   
    const skipAmount = (pageNumber - 1) * pageSize;

   
    const regex = new RegExp(searchString, "i");

 
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

  
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

      const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

   
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

   
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId:string){ 
  connectDB()
  try{
    const userThreads = await Thread.find({author:userId}) 
    const childThreadIds =  userThreads.reduce((acc,userThread)=>{ 
      return acc.concat(userThread.children) 
    },[])
    const replies = await Thread.find({ 
      _id:{$in:childThreadIds} , 
      author:{$ne:userId} 
    }).populate({
      path:'author' , 
      model:User , 
      select : 'name image _id'
    })
    return replies 

  } 
  
  catch(err:any)
  { 
    throw new Error(`Failed to fetch activity : ${err.message}`)
  }
}
export async function getUserFollowersIds(userId:string,key:string)
{ 
  try{ 
    connectDB()
    const user = await User.findOne({id:userId})
    const followersIds = user[key].map((follower:any)=>follower.user)
    return followersIds
  }
  catch(err:any)
  { 
    throw new Error("Error fetching user followers") 
  }
}
export async function fetchUsersByField(userId: string, field: string) {
  try {
    connectDB();

    const user = await User.findOne({ id: userId });

    const usersIds = user[field].map((user: any) => user.user);

    const users = await User.find({ _id: { $in: usersIds } });

    return users;
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}