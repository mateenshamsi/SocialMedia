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
export async function fetchUser(userId: string) {
  try {
    await connectDB(); // Ensure the database is connected

    return await User.findOne({ id: userId }).populate({
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
      // populate: [
      //   // {
      //   //   path: "community",
      //   //   model: Community,
      //   //   select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
      //   // },
      //   {
      //     path: "children",
      //     model: Thread,
      //     populate: {
      //       path: "author",
      //       model: User,
      //       select: "name image id", // Select the "name" and "_id" fields from the "User" model
      //     },
      //   },
      // ],
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

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

