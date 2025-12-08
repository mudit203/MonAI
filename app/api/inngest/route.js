import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { addrecurringtransaction, checkbudgetalerts, monthly_report, trigger_recurring_transactions } from "@/lib/inngest/functions";

// Create an API that serves zero functions
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    checkbudgetalerts,
    trigger_recurring_transactions,
   addrecurringtransaction,
   monthly_report
  ],
});