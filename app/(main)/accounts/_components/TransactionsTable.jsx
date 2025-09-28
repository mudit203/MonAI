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
import { fi } from 'zod/v4/locales'
import { format } from 'date-fns'
import { categoryColors } from '@/Data/categories'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Clock, MoreHorizontal, RefreshCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const Transactionstable = ({ transactions }) => {
  const filteredandsortedtransactions = transactions;

  const types = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly"
  }
  const handlesort = (arg) => {

  }
  return (
    <div>
      <Table>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox /></TableHead>
            <TableHead className="cursor-pointer" onClick={() => handlesort("date")}> <div className='flex items-center'>Date</div> </TableHead>
            <TableHead className=""><div >Description</div></TableHead>
            <TableHead className="" onClick={() => handlesort("category")}> <div className='flex items-center'>Category</div></TableHead>
            <TableHead className="" onClick={() => handlesort("amount")}> <div className='flex items-center justify-center'>Amount</div></TableHead>
            <TableHead> <div className='flex items-center '>Recurring</div></TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium">No transactions found</TableCell>
            </TableRow>
          ) : (
            transactions.map((item, index) => (
              <TableRow key={index}>
                <TableCell><Checkbox /></TableCell>
                <TableCell>{format(new Date(item.date), "PPPP")}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="capitalize">
                  <span
                    style={{ backgroundColor: categoryColors[item.category] }}
                    className="px-2 py-1 rounded text-white text-sm"
                  >
                    {item.category}
                  </span>


                </TableCell>
                <TableCell className='text-center' style={{ color: item.type === 'INCOME' ? 'green' : 'red' }}>{item.type === 'INCOME' ? '+' : '-'}${item.amount}</TableCell>
                <TableCell className="text-left">
                  {item.isReccurring ? (<Tooltip>
                    <TooltipTrigger>
                      <Badge variant='outline' className="gap-1 bg-purple-200 hover:bg-purple-300 text-purple-700">
                        <RefreshCcw className='h-3 w-3 ' />
                        {types[item.recurringInterval]}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next Date: {format(new Date(item.nextreccurringdate), "PPPP")}</p>
                    </TooltipContent>
                  </Tooltip>) : (
                    <Badge variant='outline' className="gap-1">
                      <Clock className='h-3 w-3' />
                      One-time
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger><Button variant="ghost" className="p-0 h-8 w-8"><MoreHorizontal/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem><span className='text-red-500'>Delete</span></DropdownMenuItem>
                     
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>


    </div>
  )
}

export default Transactionstable
