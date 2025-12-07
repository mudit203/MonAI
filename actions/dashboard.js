"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";



const serialized_account=(obj)=>{
  const dest_account={...obj};
  if(obj.balance){
   dest_account.balance= dest_account.balance.toNumber();
  }
  if(obj.amount){
   dest_account.amount=dest_account.amount.toNumber();
  }
  return dest_account
}

export const createaccount = async (data) => {
   try {
      const { userId } = await auth();
      if (!userId) {
         console.error("unauthorized")

      }
      const user = await db.User.findUnique({
         where: {
            clerkuserid: userId
         }
      })
      if (!user) {
         throw new Error("User does not exist");

      }
      const balancefloat = parseFloat(data.balance);
      if (isNaN(balancefloat)) {
         throw new Error("invalid balance amount")
      }
      const existing_account = await db.Account.findMany({
         where: {
            userId: user.id
         }
      })
      const should_be_default = existing_account.length === 0 ? true : data.isDefault;
      if (should_be_default) {
         await db.Account.updateMany({
            where: {
               userId: user.id,
               isDefault: true
            },
            data: {
               isDefault: false
            }
         })
      }
      const new_account=await db.Account.create({
         data:{
            ...data,
            userId:user.id,
            isDefault:should_be_default,
            balance:balancefloat
         }
    
      })
      const serial_account=serialized_account(new_account);
      revalidatePath("/dashboard")
      return {
        success:true,
        data:serial_account
      }
   } catch (error) {
   throw new Error 
   }



}

export const fetchaccount=async()=>{
   try {
       const{userId}= await auth();
       if(!userId){
      throw new Error("Unauthorized")
       }
        const user = await db.User.findUnique({
         where: {
            clerkuserid: userId
         }
      })
      if(!user){
         throw new Error("User Not Found");
      }
       const accounts=await db.Account.findMany({
         where:{
          userId:user.id
         },
         orderBy:{
            createdAt:"desc"
         },
         include:{
            _count:{
               select:{
                  transactions:true
               }
            }
         }
       })
      //   console.log(accounts);
      const serial_acc= accounts.map(acc=>{
        return serialized_account(acc)
      })
       return serial_acc
         
       


   } catch (error) {
      throw new Error(error);
   }
}


export const getDashboardData=async()=>{
   try {
       const { userId } = await auth();
      if (!userId) {
         console.error("unauthorized")
      }
       const user = await db.User.findUnique({
         where: {
            clerkuserid: userId
         }
      })
      if(!user){
         throw new Error("User Not Found");
      }
      const transactions=await db.transaction.findMany({
         where:{
            userId:user.id
         },
         orderBy:{
            date:"desc"
         }
      })
      return transactions.map(item=>serialized_account(item))
   } catch (error) {
      throw new Error(error)
   }
}