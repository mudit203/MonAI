import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_KEY);
export const sendemail=async({to,subject,react})=>{
    try {
    const data = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    react
  })


 return {success:true, resend_data:data}
    } catch (error) {
        return {success:false,error:error.message}
    }

}