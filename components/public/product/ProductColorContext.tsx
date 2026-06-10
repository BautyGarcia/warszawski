"use client";

import { createContext, useContext, useState } from "react";

type ProductColorContextValue = {
  selectedColorId: string | null;
  setSelectedColorId: (id: string | null) => void;
};

const ProductColorContext = createContext<ProductColorContextValue>({
  selectedColorId: null,
  setSelectedColorId: () => {},
});

export function ProductColorProvider({
  initialColorId = null,
  children,
}: {
  initialColorId?: string | null;
  children: React.ReactNode;
}) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    initialColorId,
  );

  return (
    <ProductColorContext.Provider value={{ selectedColorId, setSelectedColorId }}>
      {children}
    </ProductColorContext.Provider>
  );
}

export function useProductColor() {
  return useContext(ProductColorContext);
}
