"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.models"
import { connectDB } from "../mongoose"
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
      connectDB();
  
      return await User.findOne({ id: userId })
    //   .populate({
    //     path: "communities",
    //     model: Community,
    //   });
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
export async function updateUser({userId,username,name,bio,image,path}:Props):Promise<void>{
     
   try{ 
    connectDB()
    await User.findOneAndUpdate({id:userId},{username:username.toLowerCase(),name,bio,image,onboarded:true},{upsert:true})  
    if(path==='/profile/edit')
    { 
        revalidatePath(path) 
    }  
} 
catch(err:any)
{ 
    throw new Error(`Failed to update user,${err.message}`)
}
}   
