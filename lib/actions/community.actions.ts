"use server";

import { FilterQuery, SortOrder } from "mongoose";


import { connectDB } from "../mongoose";
import Thread from "../models/thread.models";
import User from "../models/user.models";
import Community from '../models/community.models';

export async function createCommunity(id:string ,username:string,name:string,image:string,bio:string,createdById:string){ 
    try{ 
        connectDB() 
        const user = await User.findById({id:createdById}) 
        if(!user)
        { 
            throw new Error("No User found") 

        } 
        const community = new Community({id,name,bio,image,username,createdBy:user._id})
        const createdCommunity = await community.save() 
        user.communities.push(createdCommunity) 
        await user.save() 
        return createdCommunity

    }
    catch(err:any)
    { 
        throw new Error("Error creating community",err) 
    }

}
export async function fetchCommunityDetails(id:string){ 
    try{ 
        connectDB() 
        const createdCommunityDetails = await Community.findOne({id}).populate([
            "createdBy" , 
            { 
                path:"members",
                model:User,
                select:'name image username id _id'
            }
        ])
        return createdCommunityDetails
    }
    catch(err:any)
    { 
        throw new Error("Error fetching community details") 
    }
}
export async  function fetchCommunityPosts(id:string){ 
    try{ 
        connectDB() 
        const communityPosts = await Community.findById({id}).populate({
            path:'threads',
            model:Thread,
            populate:[
                { 
                    path:'author',
                    model:User, 
                    select : 'name image id'
                },
           {
                path:'children',
                model:User,
                populate:[{
                    path:'author',
                    model:User,
                    select:' image _id' 
            }] 
        } ]
        })
    }
    catch(err:any)
    {
        throw new Error("Error fetching community posts")
    }
}

export async function fetchCommunities({searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy='desc' 
}:{
    searchString?:string , 
    pageNumber?:number , 
    pageSize?:number, 
    sortBy?:SortOrder  
}){   // Calculate the number of communities to skip based on the page number and page size.
    try{
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } 
  catch (error) {
    console.error("Error fetching communities:", error);
    throw error; 

}
}
export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

  
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectDB();

    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectDB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    await Thread.deleteMany({ community: communityId });

    
    const communityUsers = await User.find({ communities: communityId });

  
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}