"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, CartState } from "./cart.types";

type CartContextValue = {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "app_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw) as CartState;
        }
      } catch {}
    }
    return { items: [] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  function addItem(item: Omit<CartItem, "quantity">, qty = 1) {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);
      const nextQty = Math.min((existing?.quantity ?? 0) + qty, item.stock);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: nextQty } : i
          ),
        };
      }
      return {
        items: [
          ...prev.items,
          { ...item, quantity: Math.min(qty, item.stock) },
        ],
      };
    });
  }

  function updateQuantity(productId: number, delta: number) {
    setState((prev) => {
      const updated = prev.items
        .map((i) => {
          if (i.productId !== productId) return i;
          const nextQty = Math.min(Math.max(i.quantity + delta, 0), i.stock);
          return { ...i, quantity: nextQty };
        })
        .filter((i) => i.quantity > 0);
      return { items: updated };
    });
  }

  function removeItem(productId: number) {
    setState((prev) => ({
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  }

  function clear() {
    setState({ items: [] });
  }

  const totalItems = useMemo(
    () => state.items.reduce((acc, i) => acc + i.quantity, 0),
    [state]
  );
  const subtotal = useMemo(
    () => state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [state]
  );

  const value: CartContextValue = {
    state,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
