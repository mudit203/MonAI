"use client"

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const Scanreceipt = async() => {
     const [file, setfile] = useState(null)
     //const receptdata=await readreceipt(file);
     //console.log(receptdata)
  return (
    <div>
        <Input type="file" onChange={(e)=>setfile(e.target.files[0])}/>
    </div>
  )
}

export default Scanreceipt
