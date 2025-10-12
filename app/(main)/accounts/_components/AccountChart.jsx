"use client"

import { endOfDay, format, startOfDay, subDays } from 'date-fns'
import React, { useMemo, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { object } from 'zod'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function AccountChart({transactions}) {
    const date_ranges={
        "7D":{label:"Last 7 days", days:7},
        "1M":{label:"Last 1 month", days:30},
        "3M":{label:"Last 3 months", days:90},
        "6M":{label:"Last 6 months", days:180},

    }
    const [date, setdate] = useState("1M")
   
   const filtered_data=useMemo(() => {
   const range=date_ranges[date];
   const now=new Date();
   const startdate=range.days? startOfDay(subDays(now,range.days)):startOfDay(new Date(0))
   const filtered=transactions.filter((item)=>{
    return item.date>=startdate && item.date<=endOfDay(now)
   })
   const grouped=filtered.reduce((acc,item)=>{
   const formattedDate=format(new Date(item.date),"MMM dd");
   if(!acc[formattedDate]){
    acc[formattedDate]={formattedDate,income:0,expense:0}
   }
   
    if(item.type==="INCOME"){
        acc[formattedDate].income+=item.amount;
    }                                                                      
                                                                          //acc[formattedDate].income accesses the income property of the object stored at the key formattedDate in the accumulator object acc.

                                                                          //  Here’s how it works:

                                                                          // acc is an object where each key is a date string (e.g., "Oct 07").
                                                                          // acc[formattedDate] gets the object for that date: { formattedDate, income, expense }.
                                                                          // .income accesses the income value inside that object.
    else{
     acc[formattedDate].expense+=item.amount;
    }
   
   return acc
   },{})
   return Object.values(grouped).sort((a,b)=>new Date(a.formattedDate)-new Date(b.formattedDate));
   }, [date,transactions])
   console.log(filtered_data)

 const totals = useMemo(() => {
  return filtered_data.reduce((acc, item) => {
    acc.income = acc.income + item.income;
    acc.expense = acc.expense + item.expense;
    return acc;
  }, { income: 0, expense: 0 });
}, [filtered_data]);
  return (
  <Card>
  <CardHeader className="flex items-center justify-between pb-7">
    <CardTitle>Card Title</CardTitle>
    <Select defaultValue={date} onValueChange={(value)=>setdate(value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="SELECT RANGE" />
  </SelectTrigger>
  <SelectContent>
    {Object.entries(date_ranges).map(([key,{label}])=>{
        return  <SelectItem key={key} value={key}>{label}</SelectItem>
    })   }
  </SelectContent>
</Select>
  </CardHeader>
  <CardContent>
    <div className='text-center'>
       <p className='text-muted-foreground'>Total Income:-</p>
       <p className='text-green-500 font-bold'>{totals.income.toFixed(2)}</p>
    </div >
     <div className='text-center'>
       <p className='text-muted-foreground'>Total Expense:-</p>
       <p className='text-red-500 font-bold'>{totals.expense.toFixed(2)}</p>
    </div>
     <div className='text-center'>
       <p className='text-muted-foreground'>Net:-</p>
       <p className='font-bold text-green-500'>{totals.income.toFixed(2)-totals.expense.toFixed(2)}</p>
    </div>
     <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filtered_data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
  </CardContent>
 
</Card>
  )
}

export default AccountChart
