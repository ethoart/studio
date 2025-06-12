
'use server';
/**
 * @fileOverview Flow to send an order status update email to the customer.
 * - sendOrderStatusUpdateEmail - Function to trigger the email sending process.
 * - OrderStatusUpdateEmailInput - Input for the email flow.
 * - OrderStatusUpdateEmailOutput - Output for the email flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { OrderStatus } from '@/types';

export const OrderStatusUpdateEmailInputSchema = z.object({
  orderId: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  newStatus: z.string().describe("The new status of the order (e.g., Shipped, Delivered)"),
  itemsSummary: z.string().describe("A brief summary of items, e.g., 'Classic Trench Coat and 2 other items' or 'Your recent order'"),
  totalAmount: z.number(),
  trackingLink: z.string().url().optional().describe("Optional tracking link if the order is shipped"),
  orderLink: z.string().url().optional().describe("Link for the customer to view their order, if available"),
});
export type OrderStatusUpdateEmailInput = z.infer<typeof OrderStatusUpdateEmailInputSchema>;

export const OrderStatusUpdateEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  emailSentTo: z.string().email().optional(),
});
export type OrderStatusUpdateEmailOutput = z.infer<typeof OrderStatusUpdateEmailOutputSchema>;

// This is a stub. In a real implementation, this would call an email service.
const sendOrderStatusUpdateEmailFlow = ai.defineFlow(
  {
    name: 'sendOrderStatusUpdateEmailFlow',
    inputSchema: OrderStatusUpdateEmailInputSchema,
    outputSchema: OrderStatusUpdateEmailOutputSchema,
  },
  async (input) => {
    console.log('[AI STUB] Preparing to send order status update email with data:', JSON.stringify(input, null, 2));

    // Simulate email content generation
    let emailSubject = "";
    let emailBody = "";

    switch (input.newStatus as OrderStatus) {
      case 'Processing':
        emailSubject = `Your ARO Bazzar Order #${input.orderId} is Processing`;
        emailBody = `Dear ${input.customerName},\n\nGreat news! Your order #${input.orderId} (${input.itemsSummary}) for LKR ${input.totalAmount.toFixed(2)} is now being processed.\nWe'll let you know once it's shipped.\n\nThanks for shopping with ARO Bazzar!`;
        break;
      case 'Shipped':
        emailSubject = `Your ARO Bazzar Order #${input.orderId} Has Shipped!`;
        emailBody = `Dear ${input.customerName},\n\nYour order #${input.orderId} (${input.itemsSummary}) has shipped!\n`;
        if (input.trackingLink) {
          emailBody += `You can track your package here: ${input.trackingLink}\n`;
        }
        emailBody += `\nWe hope you enjoy your purchase from ARO Bazzar!`;
        break;
      case 'Delivered':
        emailSubject = `Your ARO Bazzar Order #${input.orderId} Has Been Delivered`;
        emailBody = `Dear ${input.customerName},\n\nGood news! Your order #${input.orderId} (${input.itemsSummary}) has been delivered.\nWe hope you love your new items!\n\nThank you for choosing ARO Bazzar.`;
        break;
      case 'Cancelled':
        emailSubject = `Your ARO Bazzar Order #${input.orderId} Has Been Cancelled`;
        emailBody = `Dear ${input.customerName},\n\nWe're writing to inform you that your order #${input.orderId} (${input.itemsSummary}) has been cancelled as per your request or due to unforeseen circumstances.\nIf you have any questions, please contact our support team.\n\nSincerely,\nThe ARO Bazzar Team`;
        break;
      default:
        emailSubject = `Update on Your ARO Bazzar Order #${input.orderId}`;
        emailBody = `Dear ${input.customerName},\n\nThere's an update on your order #${input.orderId}. The new status is: ${input.newStatus}.\nOrder details: ${input.itemsSummary}, Total: LKR ${input.totalAmount.toFixed(2)}.\n\nThanks,\nARO Bazzar`;
    }

    if (input.orderLink) {
        emailBody += `\n\nYou can view your order details here: ${input.orderLink}`;
    }

    console.log(`[AI STUB] Email to ${input.customerEmail}:`);
    console.log(`[AI STUB] Subject: ${emailSubject}`);
    console.log(`[AI STUB] Body:\n${emailBody}`);
    
    // In a real scenario:
    // 1. Use an email sending service (e.g., SendGrid, Mailgun)
    // For now, we simulate success.
    return {
      success: true,
      message: `Simulated: Email notification for order ${input.orderId} (status: ${input.newStatus}) sent to ${input.customerEmail}.`,
      emailSentTo: input.customerEmail,
    };
  }
);

export async function sendOrderStatusUpdateEmail(input: OrderStatusUpdateEmailInput): Promise<OrderStatusUpdateEmailOutput> {
  // Here you could add more logic before or after calling the flow if needed
  return sendOrderStatusUpdateEmailFlow(input);
}
