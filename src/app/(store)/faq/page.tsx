
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ShoppingCart, CreditCard, Lock, RotateCcw } from "lucide-react";

const faqData = [
  {
    value: "item-1",
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, American Express, Discover, and PayPal. We also offer Cash on Delivery (COD) for orders within Sri Lanka.",
    icon: CreditCard,
  },
  {
    value: "item-2",
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the courier's website where you can monitor its progress.",
    icon: ShoppingCart,
  },
  {
    value: "item-3",
    question: "What is your return policy?",
    answer: "You can return most items within 14 days of receipt for a full refund or exchange, provided they are in original, unworn condition with all tags attached. Some exclusions apply (e.g., swimwear, sale items). Please see our Shipping & Returns page for full details.",
    icon: RotateCcw,
  },
  {
    value: "item-4",
    question: "Is my personal information secure?",
    answer: "Absolutely. We use industry-standard SSL encryption to protect your details. Your payment information is processed securely and we never store your credit card numbers.",
    icon: Lock,
  },
  {
    value: "item-5",
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location and will be calculated at checkout. Please note that international orders may be subject to customs duties and taxes.",
    icon: HelpCircle,
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Find answers to common questions about shopping with ARO Bazzar.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((item) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem value={item.value} key={item.value} className="border bg-card rounded-md shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-base md:text-lg font-medium text-foreground hover:text-primary hover:no-underline">
                  <div className="flex items-center">
                    <IconComponent className="mr-3 h-5 w-5 text-primary/80 flex-shrink-0" />
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="mt-16 text-center">
        <h2 className="font-headline text-2xl font-semibold mb-3">Can&apos;t find an answer?</h2>
        <p className="text-muted-foreground mb-6">
          Our customer support team is happy to help.
        </p>
        <Link href="/contact">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
