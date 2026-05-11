"use client";
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const Context = createContext();

export const AuthContext = ({ children }) => {
  const [State, setState] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [addressData, setaddressData] = useState(null);

  const initialState = {
    user: "",
    email: "",
    password: "",
    flat: "",
    street: "",
    city: "",
    country: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "user":
        return { ...state, user: action.val };
      case "email":
        return { ...state, email: action.val };
      case "password":
        return { ...state, password: action.val };
      case "flat":
        return { ...state, flat: action.val };
      case "street":
        return { ...state, street: action.val };
      case "city":
        return { ...state, city: action.val };
      case "country":
        return { ...state, country: action.val };
      case "flat":
      default:
        return state;
    }
  };

  const [Data, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubsctibe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const resolvedAddress =
            userData.address ??
            userData.addresss ?? {
              flat: userData.flat ?? "",
              street: userData.street ?? "",
              city: userData.city ?? "",
              country: userData.country ?? "",
            };

          setCurrentUser({ ...user, ...userData, address: resolvedAddress});
          setaddressData(resolvedAddress);
          setState(true);
        } else {
          setCurrentUser(null);
          setState(false);
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubsctibe();
  }, []);

  return (
    <>
      <Context.Provider
        value={{
          Data,
          dispatch,
          State,
          setState,
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
