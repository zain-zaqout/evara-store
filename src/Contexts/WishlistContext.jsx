"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const wishlistContext = createContext();

export const WishlistContext = ({ children }) => {
  const [wishlis, setWishlis] = useState([]);
  const [Loading, setLoading] = useState(true)

  const { currentUser } = useAuth();

  const addToWishlis = async (product) => {
    const exi = wishlis.find((i) => product.id === i.productId);
    const newWishlis = {
      id: product.id,
      userId: currentUser?.uid || "null",
      productId: product.id,
      firstImage: product.firstImage,
      price: product.price,
    };

    if (exi) {
      return toast.error("This Product Has Alrady Added In The Wishilst!");
    }
    setWishlis([newWishlis, ...wishlis]);
    toast.success(`Product Has Successfully Added In The Wishilst`);
    if (currentUser?.emailVerified) {
      const oldWishlis = [...wishlis];
      try {
        await addDoc(collection(db, "wishlis"), newWishlis);
      } catch (error) {
        toast.error(error.message);
        setWishlis(oldWishlis);
      }
    } else {
      localStorage.setItem("wishlis", JSON.stringify([newWishlis, ...wishlis]));
    }
  };

  useEffect(() => {
    if (currentUser?.emailVerified) {
      const getData = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, "wishlis"),
            where("userId", "==", currentUser.uid),
          );
          const Data = await getDocs(q);
          const finleData = Data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWishlis(finleData);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      getData();
    } else {
      const local = localStorage.getItem("wishlis");
      if (local) {
        setWishlis(JSON.parse(local));
      }
      setLoading(false);
    }
  }, [currentUser?.emailVerified]);

  const RemoveFromWishlis = async (targetId) => {
    const oldWishlis = [...wishlis];
    const itemToRemove = wishlis.find(
      (item) => item.id === targetId || item.productId === targetId,
    );
    if (!itemToRemove) return;

    const fill = wishlis.filter(
      (item) => item.id !== targetId && item.productId !== targetId,
    );

    setWishlis(fill);
    if (fill.length === 0) {
      toast.success(`Product Has Successfully Removed From The Wishilst`);
    }

    if (currentUser?.emailVerified) {

      try {
        const q = query(
          collection(db, "wishlis"),
          where("userId", "==", currentUser.uid),
          where("productId", "==", (itemToRemove.productId || targetId))
        );

        const querySnapshot = await getDocs(q);

        const deletePromises = querySnapshot.docs.map((docItem) =>
          deleteDoc(docItem.ref)
        );

        await Promise.all(deletePromises);
      } catch (error) {
        toast.error("Database Error: " + error.message);
        setWishlis(oldWishlis);
      }
    } else {
      localStorage.setItem("wishlis", JSON.stringify(fill));
    }
  };

  return (
    <>
      <wishlistContext.Provider
        value={{ wishlis, setWishlis, addToWishlis, RemoveFromWishlis, Loading }}
      >
        {children}
      </wishlistContext.Provider>
    </>
  );
};
export const useWishlist = () => useContext(wishlistContext);
