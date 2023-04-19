import { useContext } from "react";
import CartContext from "../context/CartProvider";
import { UseCartContextType } from "../context/CartProvider";

// define and export useCart custom hook with return type is UseCartContextType
const useCart = (): UseCartContextType => {
    // return the value passed to the closest CartContext.Provider above the calling component in the tree
    // in this case is the return of useCartContext(initCartState) in CartProvider
    // if the return of useCartContext(initCartState) is undefined => the value would be initCartContextState with the type of UseCartContextType
    return useContext(CartContext)
}

export default useCart;