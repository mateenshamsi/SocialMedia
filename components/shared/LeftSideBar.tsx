"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, useAuth, useClerk } from "@clerk/nextjs";
import { sidebarLinks } from "../../constants/index";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const route = link.route === "/profile" && userId 
            ? `${link.route}/${userId}` 
            : link.route;

          return (
            <Link
              href={route}
              key={link.label}
              className={`leftsidebar_link ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <div className='flex cursor-pointer gap-4 p-4' onClick={handleSignOut}>
            <Image
              src='/assets/logout.svg'
              alt='logout'
              width={24}
              height={24}
            />
            <p className='text-light-2 max-lg:hidden'>Logout</p>
          </div>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSideBar;
