
import { redirect } from "next/navigation";


import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "../../../components/cards/ThreadCard";
import Pagination from "../../../components/shared/Pagination";
import { fetchUser } from "../../../lib/actions/user.actions";
import { fetchPosts, getReactionsData } from "../../../lib/actions/thread.actions";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) redirect('/sign-in')

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  const reactionsData = await getReactionsData({
    userId: userInfo._id,
    posts: result.posts,
  });

  const { childrenReactions, childrenReactionState } = reactionsData;

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post, idx) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                reactions={childrenReactions[idx].users}
                reactState={childrenReactionState[idx]}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;