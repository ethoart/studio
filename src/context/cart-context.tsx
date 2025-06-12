
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem, Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate a unique ID for a cart item based on product ID, color, and size
const generateCartItemId = (productId: string, color?: string, size?: string): string => {
  return `${productId}-${color || 'none'}-${size || 'none'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true); // To manage initial load from localStorage
  const { toast } = useToast();

  // Load cart from localStorage on initial mount
  useEffect(() => {
    setLoading(true);
    try {
      const storedCart = localStorage.getItem('aroBazzarCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Fallback to empty cart if localStorage is corrupted or inaccessible
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Don't save during initial load before items are populated from localStorage
    if (!loading) {
      try {
        localStorage.setItem('aroBazzarCart', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cartItems, loading]);

  const addToCart = useCallback((
    product: Product,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (!product || !product.id) {
        console.error("addToCart: Product or product ID is missing.");
        toast({ title: "Error", description: "Could not add item to cart. Product details missing.", variant: "destructive"});
        return;
    }
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({ title: "Please select a size.", variant: "destructive" });
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast({ title: "Please select a color.", variant: "destructive" });
      return;
    }

    setCartItems(prevItems => {
      const itemId = generateCartItemId(product.id, selectedColor, selectedSize);
      const existingItem = prevItems.find(item => item.id === itemId);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          id: itemId, // Use generated cart item ID
          productId: product.id, // Keep original product ID for reference
          quantity,
          selectedColor: selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A'),
          selectedSize: selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'N/A'),
        };
        return [...prevItems, newItem];
      }
    });
    toast({
      title: "Added to Cart!",
      description: `${product.name} (${selectedSize || 'N/A'}, ${selectedColor || 'N/A'}) x ${quantity} has been added.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({ title: "Item Removed", description: "The item has been removed from your cart." });
  }, [toast]);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: "Cart Cleared", description: "Your shopping cart is now empty." });
  }, [toast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Add productId to CartItem type for clarity if it's not the same as 'id' after generation
declare module '@/types' {
    interface CartItem {
        productId?: string; 
    }
}
