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


export const toggle_default=async(account_id)=>{
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
    await db.account.updateMany({
        where:{
            userId:user.id,
            isDefault:true
        },
        data:{
        isDefault:false
        }
    })
    const acc=await db.account.update({
        where:{
            id:account_id,
            userId:user.id
        },
        data:{
          isDefault:true
        }
    })
    console.log("this is the updated account u are looking for",acc)
    revalidatePath("/dashboard");

//       const acc = await db.Account.update({
//     where: { id },
//     data: {  }
//   });

   return {
    success:true,
    data:serialized_account(acc)
   }
    } catch (error) {
        console.log(error);
        return {success:false,error:error.message}
    }
   

}