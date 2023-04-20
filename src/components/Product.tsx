import React, { ReactElement, memo } from "react";
import { ProductType } from "../context/ProductsProvider";
import { ReducerAction, ReducerActionType } from "../context/CartProvider";

type PropsType = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
  inCart,
}: PropsType): ReactElement => {
  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
    .href;
  console.log(img);

  const onAddToCart = () =>
    dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });

  const itemInCart = inCart ? " → Item in Cart: ✔️" : null;

  const content = (
    <article className="produc">
      <h3>{product.name}</h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
        {itemInCart}
      </p>
      <button onClick={onAddToCart}>Add to cart</button>
    </article>
  );
  return content;
};


// function that accepts 2 arguments: the component's previous props, and its new props => should return true if the old and new props are equal
// otherwise returns false
// by default, React will compare each prop with Object.is
function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: PropsType,
  { product: nextProduct, inCart: nextInCart }: PropsType
) {
  return (
    Object.keys(prevProduct).every((key) => {
      prevProduct[key as keyof ProductType] ===
        nextProduct[key as keyof ProductType];
    }) && prevInCart === nextInCart
  );
}

// memo lets you skip re-rendering a component when its props are unchanged
// memo returns a new React component
// It behaves the same as the component provided to memo except that React will not always re-render it
// When its parent is being re-rendered unless its props have changed
const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;

// components still re-render when its own state changes
// memoization only has to do with props that are passed to the component from its parent.
// if you set a state variable to its current value => React will kip re-rendering your component even without memo
// you may still see your component function being called extra time, but the result will be discarded
