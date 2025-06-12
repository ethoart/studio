
'use server';
/**
 * @fileOverview Flow to send a new order notification email to the admin.
 * - sendNewOrderAdminNotificationEmail - Function to trigger the email sending.
 * - NewOrderAdminNotificationEmailInput - Input for the email flow.
 * - NewOrderAdminNotificationEmailOutput - Output for the email flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin-not-configured@example.com";

export const NewOrderAdminNotificationEmailInputSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  totalAmount: z.number(),
  itemsSummary: z.string().describe("A brief summary of items in the order, e.g., '3 items' or specific product names."),
  orderLink: z.string().url().describe("A direct link to view the order in the admin panel."),
  customerEmail: z.string().email().optional().describe("Customer's email, if available."),
});
export type NewOrderAdminNotificationEmailInput = z.infer<typeof NewOrderAdminNotificationEmailInputSchema>;

export const NewOrderAdminNotificationEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  emailSentTo: z.string().email().optional(),
});
export type NewOrderAdminNotificationEmailOutput = z.infer<typeof NewOrderAdminNotificationEmailOutputSchema>;

const sendNewOrderAdminNotificationEmailFlow = ai.defineFlow(
  {
    name: 'sendNewOrderAdminNotificationEmailFlow',
    inputSchema: NewOrderAdminNotificationEmailInputSchema,
    outputSchema: NewOrderAdminNotificationEmailOutputSchema,
  },
  async (input) => {
    console.log('[AI STUB] Preparing to send new order admin notification email for order:', input.orderId);
    console.log('[AI STUB] Data:', JSON.stringify(input, null, 2));


    if (ADMIN_EMAIL === "admin-not-configured@example.com") {
      const warningMsg = "Admin email not configured. Set NEXT_PUBLIC_ADMIN_EMAIL in your .env.local file to receive admin notifications. Email simulation will show as 'failed' in this case.";
      console.warn(warningMsg);
       return {
        success: false,
        message: warningMsg,
      };
    }

    // Simulate email content generation
    const emailSubject = `🎉 New Order Received at ARO Bazzar! Order ID: #${input.orderId}`;
    let emailBody = `A new order has been placed on ARO Bazzar.\n\n`;
    emailBody += `Order ID: #${input.orderId}\n`;
    emailBody += `Customer Name: ${input.customerName}\n`;
    if (input.customerEmail) {
      emailBody += `Customer Email: ${input.customerEmail}\n`;
    }
    emailBody += `Total Amount: LKR ${input.totalAmount.toFixed(2)}\n`;
    emailBody += `Items Summary: ${input.itemsSummary}\n\n`;
    emailBody += `View Order Details: ${input.orderLink}\n\n`;
    emailBody += `Please process this order at your earliest convenience.`;

    console.log(`[AI STUB] Email to admin (${ADMIN_EMAIL}):`);
    console.log(`[AI STUB] Subject: ${emailSubject}`);
    console.log(`[AI STUB] Body:\n${emailBody}`);
    
    // In a real scenario:
    // 1. Use an email sending service
    return {
      success: true,
      message: `Simulated: New order notification for ${input.orderId} sent to admin (${ADMIN_EMAIL}).`,
      emailSentTo: ADMIN_EMAIL,
    };
  }
);

export async function sendNewOrderAdminNotificationEmail(input: NewOrderAdminNotificationEmailInput): Promise<NewOrderAdminNotificationEmailOutput> {
  return sendNewOrderAdminNotificationEmailFlow(input);
}
