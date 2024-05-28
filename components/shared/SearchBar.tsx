"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
interface Props{ 
    routetype:string
}
function SearchBar({routetype}:Props){ 
    const router = useRouter()
    const [searchTerm,setSearchTerm] = useState("") 
    useEffect(()=>{
        const delayDebounceFun = setTimeout(()=>{
            if(searchTerm) router.push(`/${routetype}?q=`+searchTerm) 
            else
        { 
            router.push(`/${routetype}`) 
        }

        },300)
        return()=>clearTimeout(delayDebounceFun) 
    },[searchTerm,routetype])
    return(
        <div className="searchbar">
            <Image src="/assets/search-gray.svg"  className="object-contain" alt="search" width={24} height={24} />  
            <Input type="text" id="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Users" className="focus:outline-none border-none"/>     
        </div>
    )

}
export default SearchBar 