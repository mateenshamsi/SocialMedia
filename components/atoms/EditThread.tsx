import Image from "next/image";
import Link from "next/link";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
}

function EditThread({ threadId, currentUserId, authorId }: Props) {
  
  const parsedThreadId = JSON.parse(threadId);

  if (currentUserId !== authorId) return null;

  return (
    <Link href={`/edit-thread/${parsedThreadId}`}>
      <Image
        src="/assets/edit.svg"
        alt="edit thread"
        width={18}
        height={18}
        className="cursor-pointer object-contain"
      />
    </Link>
  );
}

export default EditThread;
