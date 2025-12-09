"use client"
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

function Hero() {
const imgref=useRef(null);

useEffect(() => {
  const imageelement=imgref.current;
const handlescroll=()=>{
    const scrollpos=window.scrollY;
    const threshhold=100;
    if(scrollpos>threshhold){
       imageelement.classList.add("scrolled")
    }
    else{
        imageelement.classList.remove("scrolled");
    }
}
window.addEventListener("scroll",handlescroll);
  return () => {
   window.removeEventListener("scroll",handlescroll);
  }
}, []);






  return (
    <div className='pb-20 px-4 '>
      
      <div className='container mx-auto text-center'>
        <h1 className='text-5xl md:text-8xl lg:[108px] pb-2 tracking-tighter font-extrabold bg-gradient-to-tr from-blue-600 to-purple-600 text-transparent bg-clip-text'>Manage your finances <br /> with inteligence</h1>
         <p className='text-3xl text-gray-500 font-bold'>
        Ai powered financial management platform
      </p>
       <div className='flex gap-3 justify-center items-center'>
       <Link href={""}> <Button size="lg" className="px-8">Get started</Button></Link>
      
      <Link href={""}> <Button size="lg" className="px-8" variant="secondary">Watch demo</Button></Link>
      </div>
      <div>
        <div className='hero-image-wrapper'>
            <div className='hero-image' ref={imgref}>
<Image src={"/heroimage.png"} height={720} width={1280} priority className='rounded-lg mx-auto shadow-2 xl' alt='dashbpard preview'/>
            </div>
         
        </div>
        
      </div>
      </div>
     
     
     
     
    </div>
  )
}

export default Hero
