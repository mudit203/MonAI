import {z} from "zod";

export const accountschema=z.object({
    name:z.string().min(1,"name is required"),
    type:z.enum(["CURRENT","SAVINGS"]),
    balance:z.string().min(1,"initial balance required"),
    isDefault:z.boolean().default(false)
})