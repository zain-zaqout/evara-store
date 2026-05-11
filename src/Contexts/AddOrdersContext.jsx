"use client";
import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const AddOrdersContext = ({ children }) => {
  
  const [order, setorder] = useState({
    id: "",
    date: "",
    status: "",
    total: null,
  });

  return (
    <OrderContext.Provider value={{ order, setorder }}>
      {children}
    </OrderContext.Provider>
  );
};
export const useOrder = () => useContext(OrderContext);
