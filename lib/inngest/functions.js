import { db } from "../prisma";
import { inngest } from "./client";

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
   }
   
  },
);

const isnewmonth=(lastelertsent,currentdate)=>{
return(lastelertsent.getMonth()!==currentdate.getMonth() || lastelertsent.getFullYear()!==currentdate.getFullYear() )
}