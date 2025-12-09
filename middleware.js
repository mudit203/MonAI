
import { RedirectToSignIn } from '@clerk/nextjs';
import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


const isprotectedroute= createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)"
])



export const clerk = clerkMiddleware(async(auth,req)=>{
  const{userId}= await auth();
  if(!userId && isprotectedroute(req)){
   const{redirectToSignIn}=await auth();
   return  redirectToSignIn();
  }
});




export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};