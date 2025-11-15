import {z} from "zod";

export const accountschema=z.object({
    name:z.string().min(1,"name is required"),
    type:z.enum(["CURRENT","SAVINGS"]),
    balance:z.string().min(1,"initial balance required"),
    isDefault:z.boolean().default(false)
})

export const transactionschema=z.object({
    
    type:z.enum(["INCOME","EXPENSE"]),
    amount:z.string().min(1,"amount is required"),
    description:z.string().optional(),
    date:z.date({required_error:"date is required"}),
    accountId:z.string().min(1,"Account is required"),
    category:z.string().min(1,"category is required"),
    isRecurring:z.boolean().default(false),
    recurringInterval:z.enum(["DAILY","WEEKLY","MONTHLY","YEARLY"]).optional(),

}).superRefine((data,ctx)=>{
    if(data.isRecurring && !data.recurringInterval){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Recurring interval is required for recurring transactions",
            path:["recurringInterval"],
        })
    }
})