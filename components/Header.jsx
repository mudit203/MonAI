import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'


import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PlusIcon, TriangleDashedIcon } from 'lucide-react'
import { checkuser } from '@/lib/CheckUser'

const Header=async()=> {
  await checkuser();
  return (
    <div className='fixed top-0 w-full backdrop-blur-lg z-50 border-b'>
      <nav  className='flex justify-between container px-3 py-4 items-center'>
        <Link rel="stylesheet" href="/">
        <Image 
        height={60}
        width={200}
        src={"/logo.png"}
        className='object-contain h-12 w-auto'
        alt='logo'
        />
        </Link>
       <div className='flex gap-2'>
        <SignedIn>
          <Link href={'/dashboard'} className='text-gray-600 hover:text-blue-500 flex items-center'>
           <Button variant="outline">
            <LayoutDashboard/>
            <span className='hidden md:inline'>Dashboard</span>
           </Button>
           
          </Link>
            <Link href={'/tranaction/create'} className='text-gray-600 hover:text-blue-500 flex items-center'>
           <Button variant="outline">
            <PlusIcon/>
            <span className='hidden md:inline'>create</span>
           </Button>
          </Link>
        </SignedIn>
<SignedOut>
       
              <SignInButton forceRedirectUrl=''> 

              <Button variant="outline">login</Button>
              </SignInButton>
              
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> 
       </div>
      


      </nav>
   
  
    </div>
  )
}

export default Header
