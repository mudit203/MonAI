"use client"
import React, { useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'

const CreateAccountDrawer = ({children}) => {
    const [open, setopen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={()=>setopen(!open)}>
  <DrawerTrigger asChild>{children}</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Create new account</DrawerTitle>
      
    </DrawerHeader>
    <div>
        <form action="">
            
        </form>
    </div>
  
  </DrawerContent>
</Drawer>
  )
}

export default CreateAccountDrawer
