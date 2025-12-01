import { fetchaccount } from '@/actions/dashboard'
import React from 'react'
import AddTransactionForm from '../_components/AddTransactionForm';
import { defaultCategories } from '@/Data/categories';
import { gettransaction } from '@/actions/tranzactions';

const page = async({searchParams}) => {
  const accounts=await fetchaccount();
  const editid=await searchParams?.edit;

   console.log("This is the edit id",editid)
   let initialdata=null;
   if(editid){
    initialdata=await gettransaction(editid)
   }
  return (
    <div  className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl font-bold bg-gradient-to-tr from-blue-600 to-purple-600 text-transparent bg-clip-text mb-8'>{editid? ("Edit Transaction"):("Add transaction")} </h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} editmode={!!editid} initialdata={initialdata}/>
      
    </div>
  )
}

export default page
