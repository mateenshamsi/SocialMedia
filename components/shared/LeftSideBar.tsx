import React from 'react'
import {sidebarLinks}  from '../../constants/index'
import Link from 'next/link'
function LeftSideBar() {
  return (
    <div>
      <section className="custom-scrollbar leftsidebar">
            <div className='flex w-full flex-1 flex-col gap-6 px-6 '> 
                {sidebarLinks.map((link)=>(
                    <Link href={link.route} key={link.label} className="leftsidebar_link" >
                        Link 
                    </Link>
                ))}
            </div>
      </section>
    </div>
  )
}

export default LeftSideBar
