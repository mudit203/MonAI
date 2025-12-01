"use server"

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fi } from "date-fns/locale";
import { err } from "inngest/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { success } from "zod";


const genai= new GoogleGenerativeAI(process.env.GEMINI_KEY)

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

export const create_transaction = async (data) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("Please login");

        }
 
        const req=await request();
        const decision=await aj.protect(req,{
         userId,
         requested:1
        })

       if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        const{remaining,reset}=decision.reason;
        console.error({
            code:"RATE LIMIT EXCEEDED",
            details:{
                remaining,
               Reset_in_seconds: reset
            }
        })
        throw new Error("Too many requests, please try again later")
      }
    throw new Error("Request blocked")
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
       id:data.accountId,
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
            id:data.accountId,
            },
            data:{
            balance:newbalace
            }
        })
          return newtransaction
        })
        
       revalidatePath("/dashboard");
       revalidatePath(`/accounts/${transaction.accountId}`);
       
       return {success:true,data:serializeAmount(transaction) }
    } catch (error) {
   console.error(error.message);
   return{success:false,message:error.message}
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

export const readreceipt=async(file)=>{
  try {
    const model=genai.getGenerativeModel({model:"gemini-2.5-flash"})
    const arraybuffer=await file.arrayBuffer();
    const base64=Buffer.from(arraybuffer).toString("base64")
   const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result=await model.generateContent([
        {
            inlineData:{
                data:base64,
                mimeType:file.type
            }
        },
        prompt
    ])
    const response=await result.response;
    const text=response.text()

    const cleanedtext = text
      .replace(/```json\s*/gi, '')   // remove ```json
      .replace(/```\s*/g, '')         // remove closing ```
      .trim();
try {
     const data=JSON.parse(cleanedtext);
     return{
        amount:parseFloat(data.amount),
        date:new Date(data.date),
        description:data.description,
        category:data.category,
        merchantName:data.merchantName
     }
    
} catch (parseError) {
    throw new Error("Unable to parse")
}
     

  } catch (error) {
    throw new Error(error)
  }
}

export const gettransaction=async(id)=>{
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
        if(!user) throw new Error("User not found")
            const trans=await db.transaction.findUnique({
        where:{
         id,
         userId:user.id
        }

    })

    return serializeAmount(trans)

    } catch (error) {
        return {error:error.message}
    }
}

export const updatetransaction=async(id,data)=>{
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
        if(!user) throw new Error("User not found")

            const originaltransaction=await db.transaction.findUnique({
                where:{
                    id,
                    userId:user.id
                },
                include:{
                    account:true
                }
            })
            const oldbalance=originaltransaction.type==="EXPENSE"? -originaltransaction.amount.toNumber():originaltransaction.amount.toNumber()
            const newbalace=data.type==="EXPENSE"? -data.amount:data.amount
            const netbalance=newbalace-oldbalance

            const transaction=await db.$transaction(async(tx)=>{
                const updated=await db.transaction.update({
                    where:{
                        id,
                        userId:user.id
                    },
                    data:{
                        ...data,
                        nextreccurringdate:data.isReccurring? calculatenextrecdate(data.date,data.recurringInterval):null
                    }
                })
                await tx.account.update({
                    where:{
                     id:data.accountId
                    },
                    data:{
                    balance:{
                        increment:netbalance
                    }
                    }
                })
                return updated
            })
            revalidatePath('/dashboard');
            revalidatePath(`/accounts/${data.accountId}`)
            
             return {success:true,data:serializeAmount(transaction)}
             
} catch (error) {
    throw new Error(error.message)
}
}