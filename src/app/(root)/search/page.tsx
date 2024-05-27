import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import UserCard from "../../../../components/cards/UserCard";
import { fetchUser, fetchUsers } from "../../../../lib/actions/user.actions";
import { useRouter } from "next/router";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  
  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });
  console.log(result)
  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>

      
       
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
        

      
    </section>
  );
}

export default Page;
