"use client"

import Image from "next/image"
import { followUser } from "../../lib/actions/user.actions"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
interface Props{ 
    userId:string , 
    currentUserId:string , 
    isFollowing ?:boolean 
}
 function FollowUser({
    userId, 
    currentUserId, 
    isFollowing=false 
}:Props){ 
    const pathname = usePathname() 
    const handleClick=async()=>{
        console.log("Current",currentUserId,"User",userId)
        await followUser({
            followerId:currentUserId,
            followedId:userId,
            path:pathname
        })

    }
    return(
        <Button size="sm"  onClick={handleClick}>
            <div className="flex cursor-pointer gap-3 rounded-lg">
                <Image src="/assets/user.svg" alt="logout" width={16} height={16}/>
                <p className="text-light-2 max-sm:hidden"> 
                    {isFollowing?"Unfollow":"Follow"}
                </p>
            </div>
        </Button> 
    )
}
export default FollowUser 