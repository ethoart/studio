
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Truck, PackageReturn, ShieldCheck } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Shipping & Returns</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Everything you need to know about how we get your order to you and our returns policy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Truck className="mr-3 h-7 w-7 text-primary" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Domestic Shipping (Sri Lanka)</h3>
              <p>Standard Shipping: LKR 350 (2-5 business days)</p>
              <p>Express Shipping: LKR 500 (1-3 business days)</p>
              <p>Free standard shipping on orders over LKR 7500.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">International Shipping</h3>
              <p>We currently offer international shipping to select countries. Rates and delivery times vary by destination and will be calculated at checkout.</p>
              <p>Please note: International orders may be subject to import duties and taxes, which are the responsibility of the recipient.</p>
            </div>
             <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Order Tracking</h3>
              <p>Once your order is shipped, you will receive a tracking number via email to monitor its progress.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <PackageReturn className="mr-3 h-7 w-7 text-primary" />
              Returns & Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary">Our Return Policy</AccordionTrigger>
                <AccordionContent>
                  We want you to love your purchase! If you're not completely satisfied, you can return most items within 14 days of receipt for a full refund or exchange, provided they are in original, unworn condition with all tags attached.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary">How to Initiate a Return</AccordionTrigger>
                <AccordionContent>
                  Please contact our customer service team at <a href="mailto:returns@arobazzar.com" className="text-primary hover:underline">returns@arobazzar.com</a> with your order number and the item(s) you wish to return. We'll guide you through the process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary">Non-Returnable Items</AccordionTrigger>
                <AccordionContent>
                  For hygiene reasons, items such as swimwear, lingerie, and earrings cannot be returned unless faulty. Sale items may also have different return conditions; please check the product page.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-primary">Refunds</AccordionTrigger>
                <AccordionContent>
                  Once we receive and inspect your returned item(s), we will process your refund to the original payment method within 5-7 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
       <div className="mt-12 text-center p-6 border rounded-lg bg-secondary/30">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-3" />
        <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Shop with Confidence</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We are committed to providing a seamless shopping experience. If you have any questions about shipping or returns, please don&apos;t hesitate to contact us.
        </p>
      </div>
    </div>
  );
}
