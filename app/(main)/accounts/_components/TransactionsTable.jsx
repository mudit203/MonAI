"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { fi } from 'zod/v4/locales'
import { format } from 'date-fns'
import { categoryColors } from '@/Data/categories'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronDown, ChevronUp, Clock, Delete, DeleteIcon, MoreHorizontal, RefreshCcw, Search, Trash, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { bulkdelete } from '@/actions/accounts'
import usefetch from '@/hooks/use-fetch'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/navigation'



const Transactionstable = ({ transactions }) => {
  //const filteredandsortedtransactions = transactions;
  const [SelectedIds, setSelectedIds] = useState([])
  const [Sortconfig, setSortconfig] = useState({
    field: "date",
    order: "desc"
  })
  const router = useRouter()
  const [typefilter, settypefilter] = useState("");
  const [recurringfilter, setrecurringfilter] = useState("");
  const [searhfilter, setsearhfilter] = useState("");
  const [Page, setPage] = useState(1);
  const handlechangepage=(index)=>{
    setPage(index);
  }
  console.log(typefilter)
  const types = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly"
  }
  const handlesort = (field) => {
    setSortconfig(prev => {
      return {
        field,
        order: prev.field == field && prev.order === "asc" ? "desc" : "asc"
      }
    })
  }

const{data,loading,error,fn,setdata}=usefetch(bulkdelete);

const handledelete=async()=>{
  if(!window.confirm( "Are you sure want to delete transactions")){
   return;
  }
  fn(SelectedIds);
  console.log("data",data.dta)
   if(error){
    toast.error(error.message)
   }
}
useEffect(() => {
  if(!loading && data){
   toast.success("successfully deleted")
  }
  
  
}, [loading,data])




  const handleselect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item != id) : [...prev, id])
  }
  const handleselectall = () => {
    setSelectedIds(prev => prev.length === filteredandsortedtransactions.length ? [] : filteredandsortedtransactions.map(item => item.id))
  }
  const handleclear=()=>{
    setrecurringfilter("");
    settypefilter("");
    setsearhfilter("");
    setSelectedIds([]);
  }

    const filteredandsortedtransactions= useMemo(() => {
      let filtered=[...transactions]
    if(searhfilter){
      const search=searhfilter.toLowerCase();
     filtered= filtered.filter((transaction)=>{
       return transaction.description.toLowerCase().includes(search)
      })
    }
    if(recurringfilter){
        filtered= filtered.filter((transaction)=>{
       if(recurringfilter==="RECURRING") return transaction.isReccurring==true;
       else return transaction.isReccurring==false;
      })
    }

     if(typefilter){
        filtered= filtered.filter((transaction)=>{
       if(typefilter==="INCOME" && transaction.type=="INCOME") return transaction ;
       else if(typefilter==="EXPENSE" && transaction.type=="EXPENSE") return transaction;
      })
    }

   //ascending and descending
      filtered.sort((a,b)=>{
        let comparison=0;
        switch (Sortconfig.field) {
          case "date":
            comparison=new Date(a.date)-new Date(b.date);
            break
          case "amount":
            comparison=a.amount-b.amount
            break
          case "category":
            comparison=a.category.localeCompare(b.category);
            
          default:
            comparison=0
        }
        return Sortconfig.order=="asc"? comparison: -comparison
      })

    return filtered;
   
  }, [transactions, searhfilter, recurringfilter, typefilter, Sortconfig])
  
  //console.log("transactions", transactions)
  // useEffect(() => {
  //  console.log("these are the selected ids",SelectedIds);


  // }, [SelectedIds,handleselect,setSelectedIds])

  return (
    <div>
      <div className='relative flex justify-center items-center gap-2'>
        <Search className='absolute left-3 w-4 h-4 text-muted-foreground'  />
        <Input Placeholder="Search transactions" className="px-10" value={searhfilter} onChange={(e)=>{setsearhfilter(e.target.value)}}  />
        <Select value={typefilter} onValueChange={(value)=>settypefilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
         
          </SelectContent>
        </Select>
        <Select value={recurringfilter} onValueChange={(value)=>setrecurringfilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RECURRING">Recurring only</SelectItem>
            <SelectItem value="NON RECURRING">Non Recurring only</SelectItem>
          
          </SelectContent>
        </Select>
        {SelectedIds.length>0 &&  <Button variant="destructive" onClick={handledelete} size="sm">
          <Trash/>
          Delete Selected ({SelectedIds.length})
        </Button> 
        }
        {(typefilter || recurringfilter || searhfilter || SelectedIds.length>0) && <Button onClick={handleclear}>
        <X/>
       </Button>}
       
      </div>
      <Table className="mt-2">

        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">< Checkbox onCheckedChange={handleselectall} checked={SelectedIds.length === filteredandsortedtransactions.length && filteredandsortedtransactions.length > 0} /></TableHead>
            <TableHead className="cursor-pointer" onClick={() => handlesort("date")}> <div className='flex items-center'>Date {Sortconfig.field === "date" ? (Sortconfig.order === "asc" ? (<ChevronUp className='w-4 h-4 ml-2' />) : (<ChevronDown className='w-4 h-4 ml-2' />)) : (<></>)}</div> </TableHead>
            <TableHead className="cursor-pointer"><div >Description</div></TableHead>
            <TableHead className="cursor-pointer" onClick={() => handlesort("category")}> <div className='flex items-center'>Category {Sortconfig.field === "category" ? (Sortconfig.order === "asc" ? (<ChevronUp className='w-4 h-4 ml-2' />) : (<ChevronDown className='w-4 h-4 ml-2' />)) : (<></>)}</div></TableHead>
            <TableHead className="cursor-pointer" onClick={() => handlesort("amount")}> <div className='flex items-center justify-center'>Amount {Sortconfig.field === "amount" ? (Sortconfig.order === "asc" ? (<ChevronUp className='w-4 h-4 ml-2' />) : (<ChevronDown className='w-4 h-4 ml-2' />)) : (<></>)}</div></TableHead>
            <TableHead> <div className='flex items-center '>Recurring</div></TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredandsortedtransactions.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium">No transactions found</TableCell>
            </TableRow>
          ) : (
            filteredandsortedtransactions.slice(Page*10-10,Page*10).map((item, index) => (
              <TableRow key={index}>
                <TableCell><Checkbox onCheckedChange={() => handleselect(item.id)} checked={SelectedIds.includes(item.id)} /></TableCell>
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
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="p-0 h-8 w-8"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem ><Button variant="neutral" onClick={()=>router.push(`/transaction/create?edit=${item.id}`)}>Edit</Button></DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>fn([item.id])}>Delete</DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
             
            ))
          )}

        </TableBody>

      </Table>
      <div className='px-auto'>
        <span>prev</span>
        <br />

        <span>{[...Array(Math.ceil(filteredandsortedtransactions.length/10))].map((item,index)=>{
          return <Button onClick={()=>handlechangepage(index+1)}>{index+1}</Button>
        })}</span>
        <br />
        <span>next</span>
        
      </div>


    </div>
  )
}

export default Transactionstable
