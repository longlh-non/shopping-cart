import { createContext, ReactElement, useState, useEffect } from "react";

// define and export ProductType
export type ProductType = {
  sku: string;
  name: string;
  price: number;
};

// define initState with type of ProductType
const initState: ProductType[] = [];

// const initState: ProductType[] = [
//     {
//         "sku": "item0001",
//         "name": "Widget",
//         "price": 9.99
//     },
//     {
//         "sku": "item0002",
//         "name": "Premium Widget",
//         "price": 19.99
//     },
//     {
//         "sku": "item0003",
//         "name": "Deluxe Widget",
//         "price": 29.99
//     }
// ]

// define and export UseProductsContextType
export type UseProductsContextType = { products: ProductType[] };

// define initContextState with the type of UseProductsContextType
const initContextState: UseProductsContextType = { products: [] };

// create ProductsContext with the return type of UseProductsContextType and initContextState is the init value
const ProductsContext = createContext<UseProductsContextType>(initContextState);

// define ChildrenType with children properties is optional and type of ReactElement or ReactElement[]
type ChildrenType = { children?: ReactElement | ReactElement[] };


// export ProductsProvider receive children and value prop receives products
export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  const [products, setProducts] = useState<ProductType[]>(initState);

  // fetch api to get data, no deps received in array as second arguments => call every re-render
  useEffect(() => {

    // define everytime re-render in the scope of useEffect and only call inside this scope
    const fetchProducts = async (): Promise<ProductType[]> => {
      const data = await fetch("http://localhost:3500/products")
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          if (err instanceof Error) console.error(err);
        });
      return data;
    };

    fetchProducts().then(products => setProducts(products));
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
