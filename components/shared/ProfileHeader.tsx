import Image from "next/image";
import Link from "next/link";
import FollowUser from "../atoms/FollowUser";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  isFollowing: boolean;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  isFollowing,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center object-cover gap-3">
          <div>
            <Image
              src={imgUrl}
              alt="Profile Image"
              className="rounded-full object-cover shadow-2xl"
              width={48}
              height={48}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-gray-1">@{username}</p>
          </div>
        </div>
        <div className="ml-auto">
          {accountId === authUserId ? (
            <Link href="/profile/edit">
              <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
                <Image
                  src="/assets/edit.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
                <p className="text-light-2 max-sm:hidden">Edit</p>
              </div>
            </Link>
          ) : (
            <FollowUser
              userId={accountId}
              currentUserId={authUserId}
              isFollowing={isFollowing}
            />
          )}
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">
        {bio}
      </p>
    </div>
  );
};

export default ProfileHeader;
