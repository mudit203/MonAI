"use client"

import { create_transaction } from '@/actions/tranzactions'
import { transactionschema } from '@/app/lib/schema'

import usefetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'

import { Form, useForm } from 'react-hook-form'
import { resolve } from 'styled-jsx/css'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Button } from '@/components/ui/button'

function AddTransactionForm({ accounts, categories }) {

    const { register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm({
        resolver: zodResolver(transactionschema),
        defaultValues: {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((acc) => acc.isDefault)?.id,
            date: new Date(),
            category: "",
            isRecurring: false,
            recurringInterval: ""

        }
    })
    const { data, loading, error, fn, setdata } = usefetch(create_transaction);
    const type = watch("type")
    const isReccuring = watch("isRecurring")
    const date = watch("date")




    return (
        <form action="">
            <div className='space-y-4'>
                <label className='text-sm font-medium'>Type</label>
                <Select onValueChange={(value) => setValue("type", value)}
                    defaultValue={type}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                        
                           
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>

                    
                    </SelectContent>
                </Select>
                {errors.type && (
                    <p className='text-sm text-red-500'>{errors.type.message}</p>
                )}
            </div>
            <div className='flex gap-3'>

            
            <div className='space-y-5'>
                <label className='text-sm font-medium'>Amount</label>
               <Input type="number" step="0.01" placeholder="0.00" className="w-[180px]" {...register("amount")}/>
                {errors.amount && (
                    <p className='text-sm text-red-500'>{errors.amount.message}</p>
                )}
            </div>
            <div className='space-y-5'>
                <label className='text-sm font-medium'>Account</label>
                <Select onValueChange={(value) => setValue("accountId", value)}
                    defaultValue={getValues("accountId")}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                       
                           
                           {accounts.map((item)=>{
                            return <SelectItem value={item.id} key={item.id}>{item.name} ({item.balance.toFixed(1)})</SelectItem>
                           })}
         <CreateAccountDrawer>
            <Button variant="ghost">Create account</Button>
         </CreateAccountDrawer>
                            
                            

                       
                    </SelectContent>
                </Select>
                {errors.type && (
                    <p className='text-sm text-red-500'>{errors.type.message}</p>
                )}
            </div>

            </div>

        </form>
    )
}

export default AddTransactionForm
