"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, this would send an email or save to a database
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          We&apos;d love to hear from you. Reach out with any questions or feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h2 className="font-headline text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" type="text" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
            <Button type="submit" size="lg" className="w-full">Send Message</Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <h2 className="font-headline text-2xl font-semibold mb-6">Our Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p>123 Fashion Avenue, Style City, FS 54321</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:info@arobazzar.com" className="hover:text-primary">info@arobazzar.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <a href="tel:+1234567890" className="hover:text-primary">(123) 456-7890</a>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-8 shadow-sm">
             <h2 className="font-headline text-2xl font-semibold mb-6">Business Hours</h2>
             <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
