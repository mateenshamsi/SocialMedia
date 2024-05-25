
import Image from "next/image";

import { redirect } from "next/navigation";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { currentUser } from "@clerk/nextjs/server";
import { fetchUser, fetchUserPosts, fetchUsers } from "../../../../lib/actions/user.actions";
import UserCard from "../../../../components/cards/UserCard";


async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);


  const result =   await fetchUsers({ 
    userId:user.id,
    searchString:"Matin", 
    pageNumber:1, 
    pageSize:10,
    sortBy:'desc'


  })
  console.log(result)
  return (
    <section className=""> 
        <h1 className="head-text mb-10">Search</h1>
        <div className="mt-14 flex flex-col gap-9">
          {result.users.length === 0 ?(
            <p className="text-light-3 ">No users</p>
          ):(<>
          {result.users.map((person)=>{
            <UserCard
            key={person.id} 
            id={person.id}
            name={person.name} 
            username={person.username} 
            imgUrl={person.image}
            personType="User" 
            />
          })}
          </>)}
        </div>
    </section>    
)
}

export default Page
