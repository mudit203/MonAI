import { categoryColors } from "@/Data/categories";


 


export async function GET(){
  return Response.json({
    hanji: categoryColors
  })
}
