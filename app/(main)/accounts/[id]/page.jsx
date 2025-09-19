import { getAccountWithTransaction } from '@/actions/accounts'
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import Transactionstable from '../_components/TransactionsTable';
const page =async ({params}) => {
    const tr=await getAccountWithTransaction(params.id);
    const{transactions,account}=tr;
  return (
    <div className='space-y-8 px-5'>
      <div className='flex justify-between gap-4 items-end'>
    <div>
      <h1 className='text-5xl sm:text-6xl font-bold tracking-tight capitalize bg-gradient-to-tr from-blue-600 to-purple-600 text-transparent bg-clip-text'>{account.name}</h1>
      <p className='text-muted-foreground mt-2 text-xl'>{account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()}</p>

    </div>
    <div className='text-right pb-2'>
      <div className='font-bold text-3xl'>${parseFloat(account.balance).toFixed(2)}</div>
      <p className='text-muted-foreground text-xl'>{account._count.transactions} Transactions</p>
    </div>
</div>
    <Suspense fallback={<BarLoader className='mt-4' width={"100%"} />}>
      <Transactionstable transactions={transactions}/>
    </Suspense>
    </div>
  )
}

export default page
