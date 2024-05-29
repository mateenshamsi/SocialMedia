import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { fetchUser, getActivity } from "../../../../lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className='head-text'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity:any) => (
                <Link
                key={activity.author._id}
                href={`${
                  (activity.parentId && `/thread/${activity.parentId}`) ||
                  `/profile/${activity.author.id}`
                }`}
              >
               <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                 
                   <ActivityComponent author={activity.author} createdAt={activity.createdAt} parentId={activity.parentId} activityType={activity.activityType} text={activity.text}/>
                 </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  )
}
const ActivityComponent= ({author,createdAt,activityType,text}:any)=>(
  <p>
    <Link key={author._id} href={`/profile/${author._id}`}> 
      <span className="text-primary-500">{author.name}</span>

    </Link>{" "}
    <> 
      {activityType==="follow"&&"followed you"}
      {activityType==="reaction"&&"like your thread"}
      {text&&`replied to your thread:"${text}`}
    </>{" "}
    
  </p>
)
export default Page;