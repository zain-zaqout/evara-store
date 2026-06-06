"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { addDoc, collection, query, where, updateDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const cartContext = createContext();

export const CartContext = ({ children }) => {
  const [Items, setItems] = useState([]);
  const [active, setActive] = useState("profile");
  const [Loading, setLoading] = useState(true);
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser?.emailVerified) {
      const getData = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, "cart"),
            where("userId", "==", currentUser.uid)
          );
          const Data = await getDocs(q);
          const finleData = Data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(finleData);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      getData();
    } else {
      const local = localStorage.getItem("cart");
      if (local) {
        setItems(JSON.parse(local));
      }
      setLoading(false);
    }
  }, [currentUser?.uid]);

  const addToCart = async (product) => {
    const exi = Items.find((i) => i.productId === product.id);

    const newCart = {
      id: product.id,
      userId: currentUser?.uid || "null",
      productId: product.id,
      firstImage: product.firstImage,
      price: product.price,
      que: 1,
    };

    if (exi) {
      toast.error("This Product Has Alrady Added In The Cart!");
      return;
    }

    const oldCart = [...Items];
    setItems([newCart, ...Items]);
    toast.success(`Product Has Successfully Added In The Cart`);
    if (currentUser?.emailVerified) {
      try {
        await addDoc(collection(db, "cart"), newCart);
      } catch (error) {
        toast.error(error.message);
        setItems(oldCart);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify([newCart, ...Items]));
    }
  };

  const removerFromCart = async (targetId) => {
    const oldCart = [...Items];
    const itemToRemove = Items.find(
      (item) => item.id === targetId || item.productId === targetId,
    );
    const fill = Items.filter(
      (item) => item.id !== targetId && item.productId !== targetId,
    );

    setItems(fill);

    toast.success(`Product Has Successfully Removed From The Cart`);
    if (currentUser?.emailVerified) {

      try {
        if (itemToRemove?.id && !itemToRemove?.productId) {
          await deleteDoc(doc(db, "cart", itemToRemove.id || targetId));
        } else if (itemToRemove?.productId) {
          const q = query(
            collection(db, "cart"),
            where("userId", "==", currentUser.uid),
            where("productId", "==", itemToRemove.productId),
          );
          const querySnapshot = await getDocs(q);
          const deletePromises = querySnapshot.docs.map((docItem) =>
            deleteDoc(docItem.ref),
          );
          await Promise.all(deletePromises);
        }
      } catch (error) {
        toast.error(error.message);
        setItems(oldCart);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(fill));
    }
  };

  const increment = async (id) => {
    const oldCart = [...Items]
    const itemToUpdate = Items.find((item) => item.id === id);
    if (itemToUpdate) {
      if (itemToUpdate.que >= 99) {
        toast.error("Maximum quantity reached for this product.");
        return;
      }
    }
    const newCart = Items.map((item) =>
      item.id === id
        ? {
          ...item,
          que: item.que < 99 ? item.que + 1 : item.que,
        }
        : item,
    );
    setItems(newCart);
    if (currentUser?.emailVerified) {
      try {
        const q = query(collection(db, "cart"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          toast.error("Item not found in the cart.");
          setItems(oldCart);
          return;
        }
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "cart", docId), { que: itemToUpdate.que + 1 });
      } catch (error) {
        setItems(oldCart)
        toast.error(error.message)
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const decrement = async (id) => {
    const oldCart = [...Items]
    const itemToUpdate = Items.find((item) => item.id === id);
    if (itemToUpdate) {
      if (itemToUpdate.que <= 1) {
        toast.error("Minimum quantity reached for this product.");
        return;
      }
    }
    const newCart = Items.map((item) =>
      item.id === id
        ? {
          ...item,
          que: item.que > 1 ? item.que - 1 : item.que,
        }
        : item,
    );
    setItems(newCart);
    if (currentUser?.emailVerified) {
      try {
        const q = query(collection(db, "cart"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          toast.error("Item not found in the cart.");
          setItems(oldCart);
          return;
        }
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "cart", docId), { que: itemToUpdate.que - 1 });
      } catch (error) {
        setItems(oldCart)
        toast.error(error.message)
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const CartTotal = Items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (Number(item.que) || 1),
    0,
  );

  const DeleveryTotal = CartTotal > 0 ? 10 : 0;
  const Total = CartTotal + DeleveryTotal;

  return (
    <>
      <cartContext.Provider
        value={{
          Items,
          setItems,
          addToCart,
          removerFromCart,
          increment,
          decrement,
          Total,
          DeleveryTotal,
          CartTotal,
          active,
          setActive,
          Loading
        }}
      >
        {children}
      </cartContext.Provider>
    </>
  );
};
export const useCart = () => useContext(cartContext);