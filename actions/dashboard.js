"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/dist/types/server";
import { revalidatePath } from "next/cache";


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
      revalidatePath("/dashboard")
      return {
         ...new_account,
         balance:new_account.balance.toNumber()
      }
   } catch (error) {
   throw new Error 
   }



}