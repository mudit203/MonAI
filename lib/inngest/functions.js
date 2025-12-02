import { sendemail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import Email from "@/emails/my-email";
import { X } from "lucide-react";
import { err } from "inngest/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkbudgetalerts = inngest.createFunction(
  { name: "Check-budget" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("check-budget-alerts", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    })
    for (const budget of budgets) {
      const defaultaccount = budget.user.accounts[0];
      if (!defaultaccount) continue
      await step.run(`check-budget-${budget.id}`, async () => {
        const startdate = new Date();
        startdate.setDate(1)
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: budget.accountId,
            type: "EXPENSE",
            date: {
              gte: startdate
            },

          },
          _sum: {
            amount: true
          }

        })
        const totalexpenses = expenses._sum.amount.toNumber();
        const budgetamount = budget?.amount;
        const percentageused = (totalexpenses / budgetamount) * 100

        if (percentageused >= 80 && (!budget.lastAlertSent || isnewmonth(new Date(budget.lastAlertSent), new Date()))) {
           await sendemail({
            to: budget.user.email,
            subject: `Budget alert for account ${defaultaccount.name}`,
            react: Email({ username: budget.user.name, type: "budget-alerts", data: { percentage: percentageused, budgetamount: parseInt(budgetamount).toFixed(1), totalexpenses: parseInt(totalexpenses).toFixed(1) } })
          })
          console.log("this is the response kyonnnnnnnnnn")
          await db.budget.update({
            where: {
              id: budget.id,

            },
            data: {
              lastAlertSent: new Date()
            }
          })

        }
        return { message: percentageused,expenses:expenses,totalexpenses,budgetamount,percentageused }
      }

      )
      // await step.run('error logs',async()=>{
      //  const muddit=await sendemail({
      //   to:budget.user.email,
      //   subject:`Budget alert for ${defaultaccount.name}`,
      //   react:Email({username:budget.user.name,type:"budget-alerts",data:{percentage:85,budgetamount:5000,totalexpenses:4000}})

      //  })
      //  return {kaint:muddit}
      //  })
    }


  },
);

const isnewmonth = (lastelertsent, currentdate) => {
  return (lastelertsent.getMonth() !== currentdate.getMonth() || lastelertsent.getFullYear() !== currentdate.getFullYear())
}


export const addrecurringtransaction = inngest.createFunction({
  name: "Add_Recurring_Transactions",
  id: "trigger_recurring_transactions"
},
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringtransactions = await step.run("fetch-recurring-transactions", async () => {
      return await db.transaction.findMany({
        where: {
          isReccurring: true,
          status: "COMPLETED",
          OR: [
            { lastprocessed: null },
            { nextreccurringdate: { lte: new Date() } }
          ]
        }
      })
    
    }
    
   

    )
    // const y=await step.run("error-logs",async()=>{
    //   const z = await db.transaction.findMany({
    //     where:{
    //       nextreccurringdate: { lte: new Date() }
    //     }
    //   })
    //   return {kyon:z}
    // })
    if (recurringtransactions?.length > 0) {
      const events = recurringtransactions.map((tr) => ({
        name: "transaction.recurring.process",
        data: { transactionId: tr.id, userId: tr.userId }
      }))
      await inngest.send(events)
    }
    return { triggered: recurringtransactions }
  }


)


export const trigger_recurring_transactions = inngest.createFunction(
  {id:"process-recurring-transaction",
    throttle:{
      limit:10,
      period:"1m",
      key:"event.data.userId"
    }
  },
  {event:"transaction.recurring.process"},
  async ({ event,step })=>{
    if(!event?.data?.userId || !event?.data?.transactionId){
      console.error("invalid event data",event)
      return {error:"Missing required event data"}
    }
    await step.run('"process transaction',async()=>{
   const transaction=await db.transaction.findUnique({
    where:{
      id:event.data.transactionId,
      userId:event.data.userId
    },
    include:{
      account:true
    }
   })
   if(!transaction || !istransactiondue(transaction)) return
   await db.$transaction(async(tx)=>{ 
    await tx.transaction.create({
      data:{
        type:transaction.type,
        amount:transaction.amount,
        description:`${transaction.description}(Recurring)`,
        date:new Date(),
        category:transaction.category,
        userId:transaction.userId,
        accountId:transaction.accountId,
        isReccurring:false
      }
    })
    const balancechange=transaction.type==="EXPENSE"? -transaction.amount.toNumber() : transaction.amount.toNumber()
    await tx.account.update({
      where:{id:transaction.accountId},
      data:{balance:{increment:balancechange}}
    })

    await tx.transaction.update({
      where:{
        id:transaction.id
      },
      data:{
      lastprocessed:new Date(),
      nextreccurringdate:calculatenextrecdate(new Date(),transaction.recurringInterval)
      }
    })
   })
    })
  }

  
  
 
)

const istransactiondue=(transaction)=>{
   if(!transaction.lastprocessed) return true
   const today=new Date()
   const nextDue=new Date(transaction.nextreccurringdate)
   return nextDue<=today
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


export const monthly_report=inngest.createFunction({
  id:"generate-monthly-reports",
  name:"Generate Monthly Reports"
},
 {cron:"0 0 1 * *"},
 async({step})=>{
  const users=await step.run("fetch-users",async()=>{
    return await db.user.findMany({
      include:{accounts:true}
    })
  })
  
  for(const user of users){
    await step.run(`generate-report-${user.id}`,async()=>{
      const lastmonth=new Date()
      lastmonth.setMonth(lastmonth.getMonth()-1);
      const stats=await getmonthlystats(user.id,lastmonth)
      const monthname=lastmonth.toLocaleString("default",{
        month:"long"
      })
      const insights=await getinsights(stats,monthname)
           await sendemail({
            to: user.email,
            subject: `Financial report of user ${user.name} for month ${monthname}`,
            react: Email({ username:user.name, type: "finance-report", data: {stats,insights,month:monthname}})
          })
      
    })
    
  }
return {processed:users.length,users}
 }
)

const getmonthlystats=async(userid,month)=>{
  const startdate=new Date(month.getFullYear(),month.getMonth(),1)
  const endDate=new Date(month.getFullYear(),month.getMonth()+1,0)
  const transactions=await db.transaction.findMany({
    where:{
      userId:userid,
      date:{
        gte:startdate,
        lte:endDate
      }
    }
  })
  
  return transactions.reduce((acc,item)=>{
    const amount = item.amount.toNumber()
    if(item.type==="EXPENSE"){
    acc.totalexpense+=amount
    acc.bycategory[item.category]=(acc.bycategory[item.category] || 0)+amount
   }
    else{
      acc.totalincome+=amount
    }
   return acc
  },{
    totalincome:0,
    totalexpense:0,
    bycategory:{},
    transactioncount:transactions.length
  })
}


const getinsights=async(stats,month)=>{
  const genai= new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model=genai.getGenerativeModel({model:"gemini-2.5-flash"})
   const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalincome}
    - Total Expenses: $${stats.totalexpenses}
    - Net Income: $${stats.totalincome - stats.totalexpenses}
    - Expense Categories: ${Object.entries(stats.bycategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
        const result=await model.generateContent(prompt)
    const response=await result.response;
    const text=response.text()
     const cleanedtext = text
      .replace(/```json\s*/gi, '')   // remove ```json
      .replace(/```\s*/g, '')         // remove closing ```
      .trim();
      return JSON.parse(cleanedtext)
  } catch (error) {
    console.error("error generating report",error)

  }
}