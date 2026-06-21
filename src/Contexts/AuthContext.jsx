"use client";
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FullPageLoader } from "../components/FullPageLoader";
import { setCookie, deleteCookie } from "cookies-next";

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
            deleteCookie("firebase_token", { path: "/" });
          }
        } catch {
          setCurrentUser(user);
          deleteCookie("firebase_token", { path: "/" });
        }
      } else {
        setCurrentUser(null);
        setaddressData(null);
        deleteCookie("firebase_token", { path: "/" });
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
