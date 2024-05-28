"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
interface Props{ 
    pageNumber :number , 
    isNext:boolean , 
    path:string  
}


const Pagination = ({pageNumber,isNext,path}:Props)=>{
    const router = useRouter()
    const handleNavigation=(type:string)=>{ 
        let nextPageNumber = pageNumber 
        if(type==="prev")
        { 
            nextPageNumber = Math.max(1,pageNumber-1) 

        } 
        else
        { 
            nextPageNumber = pageNumber+1 
        }
        if(nextPageNumber>1)
        { 
            router.push(`/${path}?page=${nextPageNumber}`) 

        }
        else
        { 
            router.push(`/${path}`)
        }
    }
    return( 
        <div className="pagination"> 

            <Button disabled={pageNumber===1}  onClick={()=>handleNavigation("prev")} className="!text-small-regular text-light-2">Prev</Button>
            <p className="text-small-semibold text-white">{pageNumber}</p>
            <Button disabled={!isNext}  onClick={()=>handleNavigation("next")} className="!text-small-regular text-light-2">Next</Button>
            
        </div>
    )
}
export default Pagination 