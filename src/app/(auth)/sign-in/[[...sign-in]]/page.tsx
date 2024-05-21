import { SignIn } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
        <SignIn path="/sign-in"/> 
  )
}

export default page
