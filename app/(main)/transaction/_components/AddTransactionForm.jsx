"use client"

import { create_transaction } from '@/actions/tranzactions'
import { transactionschema } from '@/app/lib/schema'

import usefetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'

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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar1Icon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'




function AddTransactionForm({ accounts, categories }) {

    const { register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm({
        resolver: zodResolver(transactionschema),
        defaultValues: {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((acc) => acc.isDefault)?.id,
            date: new Date(),
            category: "Salary",
            isReccurring: false,
            recurringInterval: "MONTHLY"

        }
    })
    const { data, loading, error, fn, setdata } = usefetch(create_transaction);
    const type = watch("type")
    const isReccuring = watch("isRecurring")
    const date = watch("date")
    const filteredcategories = categories.filter((cat) => cat.type === type);

    const submitform = async (data) => {
        const formdata = {
            ...data,
            amount: parseFloat(data.amount)
        }
        await fn(formdata)
    }

    useEffect(() => {

        if (data?.success && !loading) {
            toast.success("transaction created successfully")
            reset()


        }
        else if (!data?.success) {
            toast.error("Something went wrong")
        }

    }, [data, loading])



    return (
        <form onSubmit={handleSubmit(submitform)}>
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
                    <Input type="number" step="0.01" placeholder="0.00" className="w-[180px]" {...register("amount")} />
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


                            {accounts.map((item) => {
                                return <SelectItem value={item.id} key={item.id}>{item.name} ({item.balance.toFixed(1)})</SelectItem>
                            })}
                            <CreateAccountDrawer>
                                <Button variant="ghost">Create account</Button>
                            </CreateAccountDrawer>




                        </SelectContent>
                    </Select>
                    {errors.accountId && (
                        <p className='text-sm text-red-500'>{errors.accountId.message}</p>
                    )}
                </div>


            </div>
            <div className='space-y-2'>
                <label className='text-sm font-medium'>Category</label>
                <Select onValueChange={(value) => setValue("category", value)}

                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>


                        {filteredcategories.map((item) => {
                            return <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                        })}





                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className='text-sm text-red-500'>{errors.category.message}</p>
                )}

            </div>
            <div className='space-y-2'>

                <label className='text-sm font-medium'>Date</label>
                <Popover className="">
                    <PopoverTrigger asChild><Button variant="outline" className="w-full pl-3 text-left font-normal">{date ? format(date, "PPP") : (<span>pick a date</span>)}<Calendar1Icon className='ml-auto h-4 w-4 opacity-50' /></Button></PopoverTrigger>
                    <PopoverContent><Calendar mode="single" selected={date} onSelect={(date) => setValue("date", date)} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent>
                </Popover>


                {errors.date && (
                    <p className='text-sm text-red-500'>{errors.date.message}</p>
                )}

            </div>
            <div className='space-y-2'>

                <label className='text-sm font-medium'>Description</label>
                <Input placeholder="Enter description" {...register("description")} />


                {errors.description && (
                    <p className='text-sm tex t-red-500'>{errors.description.message}</p>
                )}

            </div>
            <div className='flex items-center justify-between mt-6 border-2 p-5 rounded-md '>
                <div>
                    <label htmlFor="isdefault" className='font-bold'>Recurring</label>
                    <p>This will be recurring transaction</p>
                </div>
                <Switch id="isdefault"
                    checked={isReccuring}
                    onCheckedChange={(value) => setValue("isRecurring", value)}
                />

            </div>
            {
                isReccuring &&
                (<div className='space-y-4 mt-3 mb-3'>
                    <label className='text-sm font-medium'>Type</label>
                    <Select onValueChange={(value) => setValue("recurringInterval", value)}

                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select recurring interval" />
                        </SelectTrigger>
                        <SelectContent>


                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>


                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className='text-sm text-red-500'>{errors.type.message}</p>
                    )}
                </div>)
            }
            <Button disabled={loading} variant="outline">Create transaction</Button>
            <Button>Cancel</Button>
        </form>
    )
}

export default AddTransactionForm
