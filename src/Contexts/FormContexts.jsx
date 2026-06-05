"use client"
import { createContext, useReducer, useContext } from "react";

export const Context = createContext();

export const FormContexts = ({ children }) => {
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

    return (
        <Context.Provider value={{ Data, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export const useForm = () => useContext(Context);