import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";


export const checkuser=async()=>{

    const User=await currentUser();
    if(!User){
        return null;
    }
   
    try {

         const loggedinuser=await db.User.findUnique({
        where:{
            clerkuserid:User.id
        }
    })
         if(loggedinuser){
        return loggedinuser;
    }
   const name=`${User.firstName} hanjiiii ${User.lastName}`;
   const newuser=await db.User.create({
   data:{
    clerkuserid:User.id,
    email:User.emailAddresses[0].emailAddress,
    name,
    imageurl:User.imageUrl,
    
    
   }
   })
   return newuser;
    } catch (error) {
        console.log(error);
    }
   

}