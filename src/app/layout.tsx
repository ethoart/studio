
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { DynamicThemeLoader } from '@/components/theme/dynamic-theme-loader'; // Import the new component

export const metadata: Metadata = {
  title: 'ARO Bazzar - Modern Fashion Store',
  description: 'Discover the latest trends at ARO Bazzar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <DynamicThemeLoader /> {/* Add DynamicThemeLoader here */}
        {/* Removed specific Google Font links for Inter and Playfair Display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* General preconnects are still fine, DynamicThemeLoader will add specific font links */}
      </head>
      <body className="antialiased"> {/* font-body class will be applied by Tailwind using CSS var */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
