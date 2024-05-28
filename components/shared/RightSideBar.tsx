import UserCard from "../cards/UserCard";
import { fetchUsers } from "../../lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const RightSidebar = async () => {
  let user;
  let similarMinds;

  try {
    user = await currentUser();
    if (!user) {
      redirect('/sign-in');
      
    }

    similarMinds = await fetchUsers({
      userId: user.id,
      pageSize: 4,
    });
  } catch (error) {
    throw new Error("Error fetching Users")
  }

  return (
    <section className="custom-scrollbar rightsidebar">
      
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds?.users?.length > 0 ? (
            similarMinds.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
