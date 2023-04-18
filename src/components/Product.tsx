import React, { ReactElement } from "react";
import { ProductType } from "../context/ProductsProvider";
import { ReducerAction, ReducerActionType } from "../context/CartProvider";

type PropsType = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

const Product = ({ product, dispatch, REDUCER_ACTIONS, inCart }: PropsType) => {
  return <div>Product</div>;
};

export default Product;
