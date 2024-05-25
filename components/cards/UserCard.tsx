import Image from "next/image"

interface Props{ 
    id:string , 
    name:string , 
    username:string , 
    imgUrl:string , 
    personType:string 
}

function UserCard({ 
    id,
    name,  
    username, 
    imgUrl,   
    personType }:Props) {
  return (
    <article className="flex flex-col justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center;">
        <div className="flex flex-1 items-start justify-start gap-3 xs:items-center"> 
            <Image src={imgUrl} alt="logo"  width={48} height={48} className="rounded-full"/>
            <div className="flex-1 text-ellipsis"> 
                <h4 className="text-base-semibold  text-white">{name}</h4>
                <h4 className="text-base-semibold  text-white">{name}</h4>
                

            </div>

        </div>
        
    </article>
  )
}

export default UserCard
