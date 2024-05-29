"use client"
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { addReactToThread } from '../../lib/actions/thread.actions';
import Image from 'next/image';
interface Props {
    threadId: string;
    currentUserId: string;
    interactState?: boolean;
    isComment?: boolean;
    parentId?: string | null;
  }
function ReactThread({threadId,currentUserId,interactState,isComment,parentId}:Props){
    const pathname = usePathname()
    const handleClick = async()=>{ 
        await addReactToThread({
            threadId, 
            userId:currentUserId, 
            path:pathname 
        })
    }
    return( 
        <Image src={`/assets/heart-${interactState?"filled":"gray"}.svg`} alt="Heart" width={24} height={24} onClick={handleClick}/> 

    )
}
export default ReactThread 