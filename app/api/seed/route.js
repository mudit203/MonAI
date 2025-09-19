import { seedTransactions } from "@/actions/seed";

export async function GET(params) {
    const result=await seedTransactions();
    return Response.json(result);
}


// export async function POST(){
//     return Response.json({
//         res:"Bhai get request maar yar"
//     })
// }