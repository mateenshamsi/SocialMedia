import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';
import { fetchUserPosts } from '../../lib/actions/user.actions';

interface Author {
  name: string;
  image: string;
  id: string;
}

interface Community {
  id: string;
  name: string;
  image: string;
}

interface Child {
  author: {
    image: string;
  };
}

interface Thread {
  _id: string;
  text: string;
  parentId: string | null;
  author: Author;
  community: Community | null;
  createdAt: string;
  children: Child[];
}

interface Result {
  name: string;
  image: string;
  id: string;
  threads: Thread[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: Result | null = null;

  try {
    result = await fetchUserPosts(accountId);
    if (!result) {
      console.log('No result found, redirecting to home page.');
      redirect('/');
      return null; // Ensure the function exits after redirecting
    }
    console.log(result);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    redirect('/error'); // Customize this based on your application's routing
    return null; // Ensure the function exits after redirecting
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: Thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
