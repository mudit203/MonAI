"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { includes, success } from "zod";

const serialized_account = (obj) => {
    const dest_account = { ...obj };
    if (obj.balance) {
        dest_account.balance = dest_account.balance.toNumber();
    }
    if (obj.amount) {
        dest_account.amount = dest_account.amount.toNumber();
    }
    return dest_account
}


export const toggle_default = async (account_id) => {
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


        if (!user) {
            throw new Error("User Not Found");
        }
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        })
        const acc = await db.account.update({
            where: {
                id: account_id,
                userId: user.id
            },
            data: {
                isDefault: true
            }
        })
        console.log("this is the updated account u are looking for", acc)
        revalidatePath("/dashboard");

        //       const acc = await db.Account.update({
        //     where: { id },
        //     data: {  }
        //   });

        return {
            success: true,
            data: serialized_account(acc)
        }
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message }
    }


}

export const getAccountWithTransaction = async (account_id) => {
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

        if (!user) {
            throw new Error("User Not Found");
        }
        const account = await db.account.findUnique({
            where: {
                userId: user.id,
                id: account_id
            },
            include: {
                transactions: {
                    orderBy: {
                        date: "desc"
                    },

                },
                _count: {
                    select: { transactions: true }
                }
            }
        })
        if (!account) {
            return null
        }
        return {
            account: serialized_account(account),
            transactions: account.transactions.map(serialized_account)
        }

    } catch (error) {
    return null
    }
}
 export const bulkdelete=async (accountids)=>{
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

        if (!user) {
            throw new Error("User Not Found");
        }
        const transactions=await db.transaction.findMany({
            where:{
                userId:user.id,
                id:{in:accountids}
            }

        })
        const balancechanges=transactions.reduce((acc,current)=>{
            const amount=parseFloat(current.amount);
          const change=current.type==="EXPENSE"? amount: -amount
          acc[current.accountId]=(acc[current.accountId] || 0)+change
          return acc
        },{});
       await db.$transaction(async(tx)=>{
         await tx.transaction.deleteMany({
            where:{
                id:{in:accountids},
                userId:user.id
            }
         })
        for (const[acc,change] of Object.entries(balancechanges)){
            await tx.account.update({
                where:{
                    id:acc
                },
                data:{
                 balance:{
                    increment:parseFloat(change)
                 }
                }
            })
        }
       })
        revalidatePath("/accounts/[id]");
        revalidatePath("/dashboard")
        return{
            message:"successfully deleted mudit ji",
            success:true,
            dta:accountids
        }
 } catch (error) {
    console.log(error);
    return {
        success:false,
        message:error.message
    }
 }
 }