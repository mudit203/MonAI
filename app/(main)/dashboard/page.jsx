

import CreateAccountDrawer from '@/components/CreateAccountDrawer'

import React, { Suspense } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus } from 'lucide-react'
import { fetchaccount, getDashboardData } from '@/actions/dashboard'
import Accountcard from './_components/Accountcard'
import { totalbudget } from '@/actions/budget'
import Budgetcomponent from './_components/Budgetcomponent'
import DashboardOverview from './_components/DashboardOverview'



const Dashboardpage = async() => {
 const serial_acc=await fetchaccount()
 
 
 const default_acc=await serial_acc.find((account)=>{
  return account.isDefault===true;
 });
 let budgetdata=null;
 if(default_acc){
  
  budgetdata=await totalbudget(default_acc.id);
 }
 console.log("budget of default account",budgetdata)
 console.log("this is the default account,",default_acc)
 console.log("these are all the accounts",serial_acc);

const transactions=await getDashboardData();

 
 

  return (
    <div className='px-5'>
      {
        budgetdata && (<Budgetcomponent budget={budgetdata.Budget}
        currentexpense={budgetdata.Currentexpenses || 0}>

        </Budgetcomponent>)
      }

      <Suspense fallback={"Loading overview..."}>
        <div className='mt-4'>
          <DashboardOverview transactions={transactions || []} account={serial_acc}/>
          </div> 
        
      </Suspense>
      
      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-3 mt-5'>
        <CreateAccountDrawer>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed">

          <CardContent className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-full pt-5">
            <Plus/>
            <p>Add new account</p>
          
            
          </CardContent>

        </Card>

        </CreateAccountDrawer>
       {serial_acc.length>0 && serial_acc.map((item)=>{
         return <Accountcard key={item.id} account={item} />
       })}

      </div>
    </div>
  )
}

export default Dashboardpage
