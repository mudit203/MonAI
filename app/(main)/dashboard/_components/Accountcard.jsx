"use client"

import React, { useEffect } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toLowerCase } from 'zod'
import { Switch } from '@/components/ui/switch'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { toggle_default } from '@/actions/accounts'
import usefetch from '@/hooks/use-fetch'
import { toast } from 'sonner'
function Accountcard({account}) {
// const x=await toggle_default("ef626b6d-3426-4ade-a8ea-4d7640df49e5")

 const{data,loading,error,fn,}=usefetch(toggle_default);


 const handleDefaultChange=async(e)=>{
//    e.preventDefault();
   if(account.isDefault){
    toast.warning("you need atleast 1 default account")
    return
   }
   await fn(account.id)
 }
  useEffect(() => {
    if(data?.success){
        toast.success("default account updated successfully")
    }
   
    
  }, [data,loading])
  useEffect(()=>{
    if(error){
        toast.error(error);
    }

  },[error])
 console.log("kyon",data)
    
  return (
    // <Link href={`/account/${account.id}`}>
  


    <Card>
  <CardHeader className="flex items-center justify-center justify-between">
    <CardTitle className="text-xl">{account.name}</CardTitle>
    <Switch checked={account.isDefault} disabled={loading} onCheckedChange={handleDefaultChange}/>
  </CardHeader>
  <CardContent>
    <div className='font-bold text-2xl'> 
        ${parseFloat(account.balance).toFixed(2)}
    </div>
    <div className='text-gray-500 text-xs'>
        {account.type.charAt(0).toUpperCase()+account.type.slice(1).toLowerCase()}
    </div>
  </CardContent>
  <CardFooter className="space-x-3.5">
    <div className='text-green-300 text-xs flex items-center justify-center'>
        <ArrowUpRight/>
        Income
    </div>
    <div className='text-red-500 text-xs flex items-center justify-center'>
        <ArrowDownRight/>
        Expense
    </div>
    <div>

    </div>
  </CardFooter>
</Card>
// </Link>
  )
}

export default Accountcard
