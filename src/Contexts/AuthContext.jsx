"use client";
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { FullPageLoader } from "../components/FullPageLoader";
import { setCookie } from "cookies-next";

export const Context = createContext();

export const AuthContext = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [addressData, setaddressData] = useState(null);

  useEffect(() => {
    const unsubsctibe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && user?.emailVerified) {
            const userData = userDoc.data();
            const resolvedAddress = userData.address ?? userData.addresss ?? {
              flat: userData.flat ?? "",
              street: userData.street ?? "",
              city: userData.city ?? "",
              country: userData.country ?? "",
            };

            const token = await user.getIdToken();

            const localWishlis = localStorage.getItem("wishlis");
            const localCart = localStorage.getItem("cart");

            if (localWishlis && localWishlis !== "[]") {
              const data = JSON.parse(localWishlis);

              await Promise.all(
                data.map(item =>
                  addDoc(collection(db, "wishlis"), {
                    ...item,
                    userId: user.uid,
                  })
                )
              );

              localStorage.removeItem("wishlis");
            }

            if (localCart && localCart !== "[]") {
              const data = JSON.parse(localCart);

              await Promise.all(
                data.map(item =>
                  addDoc(collection(db, "cart"), {
                    ...item,
                    userId: user.uid,
                  })
                )
              );

              localStorage.removeItem("cart");
            }

            setCookie("firebase_token", token, {
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
              secure: true,
              sameSite: "lax",
            });

            setCurrentUser({ ...user, ...userData, address: resolvedAddress });
            setaddressData(resolvedAddress);

          } else {
            setCurrentUser(user);
          }
        } catch {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setaddressData(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubsctibe();
  }, []);

  if (!isAuthReady) return <FullPageLoader />

  return (
    <>
      <Context.Provider
        value={{
          currentUser,
          setCurrentUser,
          isAuthReady,
          setaddressData,
          addressData,
        }}
      >
        {children}
      </Context.Provider>
    </>
  );
};
export const useAuth = () => useContext(Context);
