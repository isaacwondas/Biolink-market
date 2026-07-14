"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
}

interface OrderContextType {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, "quantity">) => void;
  removeItem: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  clearOrder: () => void;
  totalItems: number;
  totalPrice: number;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = (product: Omit<OrderItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increase = (id: number) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)),
    );

  const decrease = (id: number) =>
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0),
    );

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clearOrder = () => setItems([]);

  const totalItems = items.reduce((a, b) => a + b.quantity, 0);

  const totalPrice = items.reduce((a, b) => a + b.quantity * b.price, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      increase,
      decrease,
      clearOrder,
      totalItems,
      totalPrice,
    }),
    [items],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
}
