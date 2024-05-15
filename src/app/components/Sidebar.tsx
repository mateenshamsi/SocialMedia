
import React from 'react'
import {BsHouseFill,BsBellFill} from 'react-icons/bs'
import {FaUser} from 'react-icons/fa'
import SidebarLogo from '@/app/components/SidebarLogo' 
import SidebarItem from './SidebarItem';

export default function Sidebar() {
    const items = [
        { 
            label:'home' , 
            href:'/', 
            icon:BsHouseFill
        },
        { 
            label:'Notifications',
            href:"/notifications", 
            icon:BsBellFill 
        },
        { 
            label:'Profile',
            href:"/users/123", 
            icon: FaUser
        }
    ]
    return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
        <div className="flex flex-col items-end"> 
            <div className="space-y-2 lg:w-[230px] ">
                <SidebarLogo/>
                {items.map((item)=>{ 
                   <SidebarItem key={item.href} href={item.href} icon={item.icon}/> 
                })}
            </div>
        </div>
    </div>
  )
}
