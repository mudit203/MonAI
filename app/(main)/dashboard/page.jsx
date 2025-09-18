import CreateAccountDrawer from '@/components/CreateAccountDrawer'

import React from 'react'
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
import { fetchaccount } from '@/actions/dashboard'
import Accountcard from './_components/Accountcard'



const Dashboardpage = async() => {
 const {serial_acc}=await fetchaccount()
 console.log(serial_acc);
 

  return (
    <div className='px-5'>
      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-3'>
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
