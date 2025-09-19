"use client"

import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'

const Transactionstable = ({transactions}) => {
    const handlesort=(arg)=>{

    }
  return (
    <div>
       <Table>
 
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]"><Checkbox/></TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handlesort("date")}> <div className='flex items-center'>Date</div> </TableHead>
      <TableHead className=""><div >Description</div></TableHead>
      <TableHead className="" onClick={()=>handlesort("category")}> <div className='flex items-center'>Category</div></TableHead>
      <TableHead className="" onClick={()=>handlesort("amount")}> <div className='flex items-center justify-center'>Amount</div></TableHead>
      <TableHead> <div className='flex items-center'>Recurring</div></TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>


    </div>
  )
}

export default Transactionstable
