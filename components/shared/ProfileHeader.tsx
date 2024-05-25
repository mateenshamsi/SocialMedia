import Image from "next/image"
interface Props{ 
    accountId:string,
    authUserId:string,  
     name:string,
      username:string,
     imgUrl:string ,
     bio:string
}

const ProfileHeader = ({accountId,  
    authUserId,
     name,
      username,
     imgUrl,
     bio}:Props)=>{ 
    return(
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between"> 
                <div className="flex items-center object-cover gap-3"> 
                    <div> 
                        <Image src={imgUrl} alt="Profile Image" className="rounded-full object-cover shadow-2xl  " width={48} height={48}/>
                    </div>
                </div>
                <div className="flex-1 "> 
                    <h2 className="text-left text-heading3-bold text-light-1 px-4">{name}</h2>
                    <p className="px-4 text-gray-1">@{username}</p>
                 
                </div>

            </div> 
            <p className="mt-6 ml-[60px] max-w-lg text-base-regular text-light-2 ">{bio}</p>

            
        </div>
    )
}
export default ProfileHeader
