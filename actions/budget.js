"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { gte, lte } from "zod";


export const totalbudget= async(accountId)=>{
try {
     const { userId } = await auth();
            if (!userId) {
                throw new Error("Unauthorized")
            }
            const user = await db.User.findUnique({
                where: {
                    clerkuserid: userId
                }
            })
    const budget=await db.budget.findFirst({
        where:{
            userId:user.id,
        }

    })
    const currentdate=new Date();
    const startmonth=new Date(currentdate.getFullYear(),currentdate.getMonth(),1)
    const endmonth=new Date(currentdate.getFullYear(),currentdate.getMonth()+1,0)

    const expenses= await db.transaction.aggregate({
        where:{
            userId:user.id,
            accountId,
            type:"EXPENSE",
            date:{
                gte:startmonth,
                lte:endmonth,
            },

         
        },
        _sum:{
          amount:true
         }
    })
   
    return{
        Budget:budget? {...budget,amount:budget.amount?.toNumber()}:null,
        // Currentexpenses:expenses? expenses._sum.amount?.toNumber():0
        Currentexpenses:Number(expenses._sum.amount) || 0

        
    }
} catch (error) {
    console.error(error);
    throw error
}
}


export const updatebudget=async(amount)=>{
    try {
         const { userId } = await auth();
            if (!userId) {
                throw new Error("Unauthorized")
            }
            const user = await db.User.findUnique({
                where: {
                    clerkuserid: userId
                }
            })
    const budget=await db.budget.upsert({
        where:{
           userId:user.id,
        },
        update:{
         amount:amount
        },
        create:{
            userId:user.id,
            amount:amount
        }
    })
    revalidatePath("/dashboard")
    return{
        success:true,
        data:{...budget,amount:budget.amount.toNumber()}
    }
    } catch (error) {
        console.error(error);
        return {success:false,error:error.message}
    }
   
        
}