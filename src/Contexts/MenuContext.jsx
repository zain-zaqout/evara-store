"use client"
import { createContext, useContext, useState } from "react"

export const menuContext = createContext()

export const MenuContext = ({ children }) => {
    
    const [Menu, setMenu] = useState(false);

   return (
       <>
           <menuContext.Provider value={{Menu,setMenu}}>
               {children}
           </menuContext.Provider>
     </>
   )
}
 export const useMenu = () => useContext(menuContext)