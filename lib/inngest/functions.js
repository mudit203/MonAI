import { sendemail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import Email from "@/emails/my-email";

export const checkbudgetalerts = inngest.createFunction(
  { name: "Check-budget" },
  { cron: "0 */6 * * *" },
  async ({step }) => {
   const budgets= await step.run("check-budget-alerts",async ()=>{
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
   for(const budget of budgets){
    const defaultaccount=budget.user.accounts[0];
    if(!defaultaccount) continue
    await step.run(`check-budget-${budget.id}`,async()=>{
      const startdate=new Date();
      startdate.setDate(1)
     const expenses= await db.transaction.aggregate({
        where:{
          userId:budget.userId,
          accountId:budget.accountId,
          type:"EXPENSE",
          date:{
            gte:startdate
          },

      },
      _sum:{
        amount:true
      }

    })
    const totalexpenses=expenses._sum.amount.toNumber();
    const budgetamount=budget.amount;
    const percentageused=(totalexpenses/budgetamount)*100

    if(percentageused>=80 && (!budget.lastAlertSent || isnewmonth(new Date(budget.lastelertsent),new Date()))){
   const xuxx=await sendemail({
    to:budget.user.email,
    subject:`Budget alert for account ${defaultaccount.name}`,
    react:Email({username:budget.user.name,type:"budget-alerts",data:{percentage:percentageused,budgetamount:parseInt(budgetamount).toFixed(1),totalexpenses:parseInt(totalexpenses).toFixed(1)}})
   })
   console.log("this is the response",xuxx)

await db.budget.update({
  where:{
    id:budget.id,

  },
  data:{
    lastAlertSent:new Date()
  }
})

    }
    return {message:percentageused}
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

const isnewmonth=(lastelertsent,currentdate)=>{
return(lastelertsent.getMonth()!==currentdate.getMonth() || lastelertsent.getFullYear()!==currentdate.getFullYear() )
}