import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import '../globals.css';
import TopBar from '../../../components/shared/TopBar';
import LeftSideBar from '../../../components/shared/LeftSideBar';
import BottomBar from '../../../components/shared/BottomBar';
export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application',
}
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import RightSideBar from '../../../components/shared/RightSideBar';
const inter = Inter({subsets:["latin"]})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
  >
    <html lang='en'>
      <body className={inter.className}>
        <TopBar />

        <main className='flex flex-row'>
          <LeftSideBar />
          <section className='main-container'>
            <div className='w-full max-w-4xl'>{children}</div>
          </section>
          {/* @ts-ignore */}
          <RightSideBar />
        </main>

        <BottomBar />
      </body>
    </html>
  </ClerkProvider>
  )
}