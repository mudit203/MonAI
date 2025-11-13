import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const create_transaction = async (data) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("Please login");

        }
        const user = await db.User.findUnique({
            where: {
                clerkuserid: userId
            }
        })
        if (!user) {
            throw new Error("User Not Found");
        }
       const account=await db.account.findUnique({where:{
       id:data.account_id,
       userId:user.id
       }})
        const balance= data.type==="EXPENSE"? -data.amount:data.amount
        const newbalace=account.balance.toNumber()+balance
        const transaction=await db.$transaction(async (tx)=>{
            const newtransaction=await tx.transaction.create({
                data:{
                ...data,
                userId:user.id,
                nextreccurringdate:data.isReccurring && data.recurringInterval?calculatenextrecdate(data.date,data.recurringInterval):null
                }
                

            })
        await tx.account.update({
            where:{
            id:data.account_id,
            },
            data:{
            balance:newbalace
            }
        })
          return newtransaction
        })
       revalidatePath("/dashboard"),
       revalidatePath(`accounts/${transaction.accountId}`);
    } catch (error) {
   console.error(error.message);
    }
}

const calculatenextrecdate=(date,recurringinterval)=>{
    switch (recurringinterval){
        case "DAILY":
            date.setDate(date.getDate()+1)
           break;
        case "WEEKLY":
            date.setDate(date.getDate()+7)
            break;

         case "MONTHLY":
            date.setMonth(date.getMonth()+1)
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear()+1)
            break;
    } 
  
    return date;
}