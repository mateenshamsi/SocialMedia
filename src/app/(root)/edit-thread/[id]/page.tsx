
import { redirect } from "next/navigation";
import React from "react";
import PostThread from "../../../../../components/forms/PostThread";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "../../../../../lib/actions/user.actions";
import { fetchThreadById } from "../../../../../lib/actions/thread.actions";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <>
      <h1 className="head-text">Edit Thread</h1>

      <PostThread
        userId={userInfo._id}
        threadId={thread.id}
        threadText={thread.text}
      />
    </>
  );
};

export default Page;