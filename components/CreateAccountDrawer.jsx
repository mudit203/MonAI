"use client"
import React, { useEffect, useState } from 'react'
import {
  Drawer,

  DrawerClose,

  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { useFormState } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountschema } from '@/app/lib/schema'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from './ui/switch'
import usefetch from '@/hooks/use-fetch'
import { createaccount } from '@/actions/dashboard'
 import { Loader } from 'lucide-react'
import { toast } from 'sonner'
                                           

const CreateAccountDrawer = ({ children }) => {
  const [open, setopen] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({                                                                                                   
    resolver: zodResolver(accountschema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false
    }
  });

const{data,loading,error,fn,setdata}=usefetch(createaccount);                              //  Component mounts → usefetch creates fn → onSubmit defined → User submits → 
                                                                                          // handleSubmit validates → calls onSubmit(data) → fn(data) → createaccount server action → usefetch updates states → useEffect triggers toast/drawer close
                                                                                          
useEffect(() => {
  if(data && loading==false){
    toast.success("account created successfully");
    setopen(false)
  } 
}, [loading,data])

useEffect(() => {
 if(error){
  toast.error(error.message || "failed to create account")
 }
}, [error])



  const onSubmit=async(data)=>{
     await fn(data);
  }




  return (
    <Drawer open={open} onOpenChange={() => setopen(!open)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new account</DrawerTitle>

        </DrawerHeader>
        <div className='py-4 px-4'>
          <form action="" className='space-y-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <label htmlFor="name" className='text-sm font-bold '>account name</label>
              <Input id="name"
                placeholder="main check"
                {...register("name")}
              />
              {errors.name && (
                <p className='"text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor="type" className='text-sm font-bold'>account type</label>
              <Select onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>

                </SelectContent>
              </Select>

              {errors.type && (
                <p className='"text-sm text-red-500'>{errors.type.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor="name" className='text-sm font-bold '>Balance</label>
              <Input id="balance"
                type="number"
                placeholder="Input balance"
                step="0.01"
                {...register("balance")}
              />
              {errors.balance && (
                <p className='"text-sm text-red-500'>{errors.balance.message}</p>
              )}
            </div>
            <div className='flex items-center justify-between '>
              <div>
                <label htmlFor="isdefault">set as default account</label>
                <p>this will be the default account</p>
              </div>
              <Switch id="isdefault"
              onCheckedChange={(value)=>{
                setValue("isDefault",value)}}
                checked={watch("isDefault")}
                />

            </div>
            <div className='flex items-center justify-center gap-2'>
              <DrawerClose asChild><Button className="flex-1">close</Button></DrawerClose>
             {/* {loading? <Loader/> : (<Button className="flex-1" type="submit">  Create account</Button>)}  */}
             <Button className="flex-1" type="submit">{loading? <Loader animate="spin"/> : ("Create account")}</Button>
            </div>
            
          </form>
        </div>

      </DrawerContent>
    </Drawer>
  )
}

export default CreateAccountDrawer
