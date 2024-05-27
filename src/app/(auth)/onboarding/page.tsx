import { currentUser } from "@clerk/nextjs/server";
import AccountProfile from "../../../../components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();

  // Define userInfo with default values
  const userInfo = {
    _id: "",
    username: "",
    name: "",
    firstName: "",
    bio: "",
    image: ""
  };

  // Construct userData ensuring all fields have default values if they are undefined
  const userData = {
    id: user?.id || "",
    objectId: userInfo._id,
    username: userInfo.username || user?.username || "",
    name: userInfo.name || user?.firstName || "",
    bio: userInfo.bio || "",
    image: userInfo.image || user?.imageUrl || ""
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 w-full h-full mt-10">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
