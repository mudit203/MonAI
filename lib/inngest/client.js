import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "MonAI",name:"MONAI",
    retryFunction: async(attempt)=>({
     delay: Math.pow(2,attempt)*100,
     maxAttempts:2
    
    })
 });