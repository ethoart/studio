
import { Header } from '@/components/store/header';
import { Footer } from '@/components/store/footer';
import { CartProvider } from '@/context/cart-context'; // Import CartProvider

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider> {/* Wrap with CartProvider */}
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
