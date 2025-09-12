import React, { Suspense } from 'react'
import Dashboardpage from './page'
import {BarLoader} from 'react-spinners'
const layout = () => {
  return (
   <div className='px-5'>
    
      <h1 className='text-6xl font-bold bg-gradient-to-tr from-blue-600 to-purple-600 text-transparent bg-clip-text mb-5'>
        Dashboard
      </h1>

      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} />}>
         <Dashboardpage/>
      </Suspense>
     


    </div>
  )
}

export default layout
