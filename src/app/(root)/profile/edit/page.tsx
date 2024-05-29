import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "../../../../../lib/actions/user.actions";
import { fetchThreadById } from "../../../../../lib/actions/thread.actions";
import PostThread from "../../../../../components/forms/PostThread";
import { object } from "zod";
import AccountProfile from "../../../../../components/forms/AccountProfile";


const Page = async () => {
  

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const userData ={ 
    id:user.id ,
    username:userInfo?.username,
    objectId:userInfo?._id , 
    bio:userInfo?.bio,
    name:userInfo?.name, 
    image:userInfo?.image 


  }
  
  return (
    <>
      <h1 className="head-text">Edit User Details</h1>

      <AccountProfile
        user={userData} btnTitle="continue"
       />
    </>
  );
};

export default Page;