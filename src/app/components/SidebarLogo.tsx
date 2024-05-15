'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { BsTwitter } from "react-icons/bs";
function SidebarLogo() {
  const router = useRouter();
  return (
    <div onClick={()=>{router.push('/')}}className="h-20 w-14 p-4 flex items-center justify-center rounded-full hover:bg-opacity-10 hover:bg-blue-300  cursor-pointer transition">
      <BsTwitter size={28} />
    </div>
  );
}

export default SidebarLogo;
