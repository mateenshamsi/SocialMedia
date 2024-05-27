"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

function UserCard({
  id,
  name,
  username,
  imgUrl,
  personType
}: Props) {
  const router = useRouter(); // Mount the router

  return (
    <article className="flex flex-col justify-between gap-4 max-xs:rounded-xl max-xs:bg-dark-3 max-xs:p-4 xs:flex-row xs:items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <Image
          src={imgUrl}
          alt={`${name}'s profile picture`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-white">{name}</h4>
          <h5 className="text-base text-gray-400">@{username}</h5>
        </div>
      </div>
      <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
        View
      </Button>
    </article>
  );
}

export default UserCard;
