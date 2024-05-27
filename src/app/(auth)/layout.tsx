import {ClerkProvider, UserButton} from '@clerk/nextjs'
import {Inter}  from 'next/font/google'
import '../globals.css'
import { dark } from "@clerk/themes";

export const metadata = {
    title: 'Threads',
    description: 'A Next.js 13 Meta Threads Application',
  }
const inter = Inter({
    subsets:["latin"] 
  })
  export default function RootLayout({children

  }:{children:React.ReactNode
  }){ 
    return (
    <ClerkProvider   appearance={{
      baseTheme: dark,
    }}> 
        <html lang="en"> 
            <body className={`${inter.className} flex justify-center items-center mt-8  `} > 
                {children}
             
            </body>
            
        </html>
    </ClerkProvider>) 
  }