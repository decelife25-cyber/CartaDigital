import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { ProductoConAlergenos } from '../types/database';

export interface SelectionItem {
  dish: ProductoConAlergenos;
  quantity: number;
}

interface SelectionContextType {
  items: SelectionItem[];
  addItem: (dish: ProductoConAlergenos, quantity?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearSelection: () => void;
  totalItems: number;
  totalPrice: number;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SelectionItem[]>([]);

  const addItem = (dish: ProductoConAlergenos, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish, quantity }];
    });
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
    );
  };

  const clearSelection = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + ((item.dish.precio || 0) * item.quantity), 0), [items]);

  return (
    <SelectionContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearSelection,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
