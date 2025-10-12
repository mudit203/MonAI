"use client"

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import usefetch from '@/hooks/use-fetch';
import { toast } from 'sonner';
import { updatebudget } from '@/actions/budget';
import { Progress } from '@/components/ui/progress';



function Budgetcomponent({budget,currentexpense}) {
  const [isEditing, setisEditing] = useState(false);
  const [Budget, setBudget] = useState(budget?.amount.toString() || "0")
  const percentageused=(currentexpense/budget.amount)*100;
  console.log("Current expense",currentexpense)
 const handlecancel=()=>{
    setBudget(budget?.amount.toString())
    setisEditing(false)
 }
 const {data,loading,error,fn,setdata}=usefetch(updatebudget)
 const handleupdate= async()=>{
    const amount=parseFloat(Budget)
    if(isNaN(amount) || amount<=0){
        toast.error("Please enter a valid amount")
        return
    }
    await fn(amount)

 }
  useEffect(() => {
    if(data?.success){
      setisEditing(false)
      toast.success("budget created successfully")
    }
  
  
  }, [data])
  useEffect(() => {
    if(error){
      toast.error("Error")
    }
  
    
  }, [error])
  

  return (
    <div>
   <Card>
  <CardHeader>
    <CardTitle>Monthly budget</CardTitle>
   <div className='flex justify-between'>
  {  isEditing?  (<div className='flex gap-3'><Input type="number" onChange={(e)=>setBudget(e.target.value)} className="w-32" placeholder="enter amount" autoFocus/>
  <Button variant="ghost" onClick={handleupdate}><Check/></Button>
  <Button variant="ghost" onClick={handlecancel}><X /></Button>
  </div>):(<><CardDescription>{`${currentexpense} amount used of ${budget?.amount.toString()}`}</CardDescription>
  <Button onClick={()=>setisEditing(true)} variant="ghost"><Pencil/></Button>
  </>)}
   </div>
    
  
  </CardHeader>
  <CardContent>
    <Progress value={percentageused} />
  </CardContent>
  
</Card>
    </div>
  )
}

export default Budgetcomponent
