"use client"

import React, { useState } from 'react'
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
import { format } from 'date-fns'
import { ArrowBigDown, ArrowBigUp, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

const DashboardOverview = ({ transactions, account }) => {
    const [selectedaccount, setselectedaccount] = useState(account.find((acc) => {
        return acc.isDefault
    })?.id || account[0]?.id)
    console.log("these are transactions", transactions)

    const accounttransactions = transactions.filter((item) => {
        return item?.accountId === selectedaccount
    })
    //console.log("this is TRUE check",item?.accountId === selectedaccount?.id)
    console.log("these are accounttransactions", accounttransactions)

    const colors = [
        "#FFB6C1", // Light Pink
        "#87CEEB", // Sky Blue
        "#98FB98", // Pale Green
        "#DDA0DD", // Plum
        "#F0E68C", // Khaki
        "#FFE4B5", // Moccasin
        "#E0BBE4", // Lavender
        "#FFDAB9", // Peach Puff
        "#B0E0E6", // Powder Blue
        "#F5DEB3", // Wheat
    ]

    const recentTransactions = accounttransactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
    }).slice(0, 5)
    console.log("these are recent ones", recentTransactions)
    console.log("this is the selected account", selectedaccount)

    const currentdate = new Date()
    const currentmonthexpenses = accounttransactions.filter((tr) => {
        const transactiondate = new Date(tr.date);
        return tr.type === "EXPENSE" && transactiondate.getMonth() === currentdate.getMonth() && transactiondate.getFullYear() === currentdate.getFullYear()
    })

    const groupbycategory = accounttransactions.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += item.amount
        return acc;

    }, {})
    const chartdata = Object.entries(groupbycategory).map(
        ([category, amount]) => ({
            name: category,
            value: amount
        })
    )
    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-normal">Card Title</CardTitle>

                    <Select value={selectedaccount} onValueChange={(value) => setselectedaccount(value)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {account.map((item, index) => {
                                return <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>

                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>


                        {recentTransactions.length == 0 ? (<p className='text-muted-foreground py-4 text-center'>No recent Transactions</p>) : (
                            recentTransactions.map((item) => {
                                return <div className='flex items-center justify-between' key={item.id}>
                                    <div className='space-y-1'>
                                        <p className='text-sm font-medium leading-none'>
                                            {item.description || "Untitled transaction"}
                                        </p>
                                        <p className='text-sm text-muted-foreground'>
                                            {format(new Date(item.date), "PP")}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className={cn("flex items-center", item.type === "EXPENSE" ? "text-red-500" : "text-green-500")}>
                                            {item.type === "EXPENSE" ? (<ArrowDownRight className='mr-1 h-4 w-4' />) : (<ArrowUpRight className='mr-1 h-4 w-4' />)}
                                            ${item.amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            })

                        )}
                    </div>
                </CardContent>

            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    
                </CardHeader>
                <CardContent>
                    {chartdata.length === 0 ? (<p>No expenses this month</p>) :
                        (
                            <div className='h-[300px]'>                         <ResponsiveContainer width='100%' height={300}>
                        <PieChart>
                            {/* <defs>
                                <pattern id="pattern-checkers" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <rect className="checker" x="0" width="5" height="5" y="0" />
                                    <rect className="checker" x="10" width="5" height="5" y="10" />
                                </pattern>
                            </defs> */}
                            <Pie data={chartdata} cx="50%" cy="50%" outerRadius={80} label={({name,value})=>`${name}:$${value.toFixed(2)}`} dataKey="value" fill='#8884d8'>
                                {chartdata.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index%colors.length]} />
                                ))}
                            </Pie>
                            <Legend/>
                        </PieChart>
                        
                        </ResponsiveContainer>
                        </div>

                        )}
                </CardContent>

            </Card>
        </div>
    )
}

export default DashboardOverview
