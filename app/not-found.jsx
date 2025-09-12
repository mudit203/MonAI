import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const notfound = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
    <p> hanji ki haal notfound bhai home page pe jaa</p>
    <Link href="/"> <Button>linkReturn to home</Button></Link>
   
    </div>
  )
}

export default notfound
