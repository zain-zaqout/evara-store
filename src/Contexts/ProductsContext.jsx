"use client";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";

export const Context = createContext();
export const ProductsContext = ({children}) => {
    const [products, setProducts] = useState([]);
  const [Errors, setErrors] = useState(null)
  const [Loading, setLoading] = useState(true)
  useEffect(() => {
      const getProducts = async () => {
        setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        if (!querySnapshot) throw new Error("Invalid")
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
        ...doc.data()
        }))
        setProducts(productsData)
      } catch (error) {
          setErrors(error.message)
      } finally {
          setLoading(false)
      }
    };
    getProducts();
  }, []);
  const mainProducts = products.slice(0, 8)

    return (
        <Context.Provider value={{Errors, products, mainProducts, Loading}}>
            {children}
        </Context.Provider>
    )
};

export const useProducts = () => useContext(Context)