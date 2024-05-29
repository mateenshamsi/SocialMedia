"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { deleteThread } from "../../lib/actions/thread.actions"
import { usePathname } from "next/navigation"
interface Props{ 
    threadId:string , 
    currentUserId:string , 
    authorId:string , 
    parentId:string|null, 
    isComment?:boolean 
}
function DeleteThread({threadId,currentUserId,parentId,authorId,isComment}:Props){ 
    const path = usePathname()
    const router = useRouter() 
    if(currentUserId!==authorId) return null 
    const handleClick = async()=>{ 
        await deleteThread(JSON.parse(threadId), path)
        if(!parentId||!isComment)
            { 
                router.push("/")
            }
    }
    return( 
        <Image
        src="/assets/delete.svg"
        alt="delte"
        width={18}
        height={18}
        className="cursor-pointer object-contain"
        onClick={handleClick}
      />
    )
}
export default DeleteThread 
 
