import { ReactElement, createContext, useMemo, useReducer } from "react";


// define and export CartItemType type
export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  qty: number;
};

// define CartStateType type
type CartStateType = { cart: CartItemType[] };

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT",
};

// define and export ReducerActionType with the type of REDUCER_ACTION_TYPE
export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

// define and export ReducerAction type
export type ReducerAction = {
  type: string;
  payload?: CartItemType;
};

// define reducer function that specifies how the state gets updated
// this mus be pure and take the state and action as arguments and should return the next state
// state and action can be of any types
const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD:{
      if (!action.payload)
        throw new Error("action.payload missing in ADD action");

      const { sku, name, price } = action.payload;

      const filteredItem: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );

      const qty = itemExists ? itemExists.qty + 1 : 1;
      
      return { ...state, cart: [...filteredItem, { sku, price, name, qty }] };}
    case REDUCER_ACTION_TYPE.REMOVE:{
      if (!action.payload)
        throw new Error("action.payload missing in REMOVE action");

      const { sku } = action.payload;

      const filteredItem: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      return { ...state, cart: [...filteredItem] };}

    case REDUCER_ACTION_TYPE.QUANTITY:{
      if (!action.payload)
        throw new Error("action.payload missing in QUANTITY action");


        const { sku, qty } = action.payload;
  
        const itemExists: CartItemType | undefined = state.cart.find(
          (item) => item.sku === sku
        );

        if (!itemExists) throw new Error('Item not exist in order to update quantity');

        const filteredItem: CartItemType[] = state.cart.filter(
            (item) => item.sku !== sku
          );
        const updatedItem = {...itemExists, qty}

      return { ...state, cart: [...filteredItem, updatedItem] };}

    case REDUCER_ACTION_TYPE.SUBMIT:
        return { ...state, cart: [] };
        
    default:
      throw new Error("Unidentified reducer action type");
  }
};


// define useCartContext receive initCartState with type of CartStateType as parameter
const useCartContext = (initCartState: CartStateType) => {
  // define state and dispatch from the return value of useReducer hook
  // initCartState - the value from which the initial state is calculated => can be any value of any type
  // => How the initial state is calculated from it depends on the next ini argument.
  // optional init: the init function that should return the init state. if not specified => set to initCartState otherwise, the init state is set to the result of calling init(initCartState)
  const [state, dispatch] = useReducer(reducer, initCartState);

  // memoize REDUCER_ACTION_TYPE into REDUCER_ACTIONS - because this value never change when re-render
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  const totalItems: number = state.cart.reduce((previousValue, cartItem) =>{
    return previousValue + cartItem.qty
  }, 0);

  const totalPrice: string = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD'
  }).format(state.cart.reduce((previousValue, cartItem) => {
    return previousValue + (cartItem.qty*cartItem.price)
  }, 0));

  const cart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));

    return itemA - itemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart };
}

//export and define UseCartContextType is the return type of useCartContext
export type UseCartContextType = ReturnType<typeof useCartContext>

//define initCartContextState - the init value of context state
const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: '',
  cart: []
};

// create cart context with return type of UseCartContextType with init value is initCartContextState
export const CartContext = createContext<UseCartContextType>(initCartContextState);

// define ChildrenType with children (optional) with type of ReactElement or ReactElement[]
type ChildrenType = { children?: ReactElement | ReactElement[] };

// export CartProvider with CartContext.Provider syntax, receive children prop and value prop receives useCartContext(initCartState) as value
export const CartProvider =  ({ children }: ChildrenType): ReactElement => {
  return (<CartContext.Provider value={useCartContext(initCartState)}>
    {children}
  </CartContext.Provider>)
};

export default CartContext;