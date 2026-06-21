"use client"
import { createContext, useReducer, useContext, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export const Context = createContext();

export const FormContexts = ({ children }) => {
    const [mode, setMode] = useState("createAccount")
    const { currentUser } = useAuth();
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
            default:
                return state;
        }
    };

    const [Data, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (currentUser?.user && Data.user === "") {
            dispatch({ type: "user", val: currentUser.user });
        }
    }, [currentUser]);

    return (
        <Context.Provider value={{ Data, dispatch, mode, setMode }}>
            {children}
        </Context.Provider>
    )
}

export const useForm = () => useContext(Context);