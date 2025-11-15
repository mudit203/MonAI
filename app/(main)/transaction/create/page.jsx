import { fetchaccount } from '@/actions/dashboard'
import React from 'react'
import AddTransactionForm from '../_components/AddTransactionForm';
import { defaultCategories } from '@/Data/categories';

const page = async() => {
  const accounts=await fetchaccount();

  return (
    <div  className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl font-bold bg-gradient-to-tr from-blue-600 to-purple-600 text-transparent bg-clip-text mb-8'>Add transaction</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories}/>
    </div>
  )
}

export default page
