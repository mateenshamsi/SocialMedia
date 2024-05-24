"use server"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.models"
import User from "../models/user.models"
import { connectDB } from "../mongoose"

interface Props{
    text :string , 
    author:string , 
    communityId:string|null, 
    path:string 
}

export async function createThread({text,author,communityId,path}:Props){ 
    try{ 
        connectDB() 
        const createdThread = await Thread.create({ 
            text , 
            author , 
            community:null,


        })
        await User.findByIdAndUpdate(author,{
            $push:{threads:createdThread._id} 

        })
        await createdThread.save() 
        revalidatePath(path)
    }
    catch(e:any)
    { 
        throw new Error(e) 
    }
}
export async function fetchPosts(pageNumber=1,pageSize=20){
    
    try{ 
    await connectDB()

        const skipAmount = (pageNumber-1)*pageSize; 
     const postQuery = Thread.find({parentId:{$in:[null,undefined]}}) //to find parent thread 
                             .sort({createdAt:'desc'})  // to sort in latest order of threads
                             .skip(skipAmount) 
                             .limit(pageSize) // to show limited threads on a single page i.e pagination 
                             .populate({path:'author',model:User})
                             .populate({path:'children',
                                populate:{ 
                                    path:'author',
                                    model:User, 
                                    select:"_id name parentId image" 
                                }
                             })
                             const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null,undefined]}}) 
                             const posts = await postQuery.exec() 
                             const isNext = totalPostsCount>skipAmount+posts.length
                             return {posts,isNext}
                             
                              
    }
    catch(err:any)
    { 
        throw new Error(err)
    }
}