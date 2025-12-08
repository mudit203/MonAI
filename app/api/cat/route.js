import { categoryColors } from "@/Data/categories";


 

export const dynamic = 'force-dynamic';
export async function GET(){
  return Response.json({
    hanji: categoryColors
  })
}
