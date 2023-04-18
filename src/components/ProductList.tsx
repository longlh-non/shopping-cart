import React from 'react'
import useCart from '../hooks/useCart'
import useProducts from '../hooks/useProducts'
import { UseProductsContextType } from '../context/ProductsProvider'
import { ReactElement } from 'react'
import Product from './Product'

const ProductList = () => {
  const {dispatch, REDUCE_ACTION, cart} = useCar()
  const { products } = useProducts()

  let pageContent: ReactElement | ReactElement[] = <p>Loading...</p>

  if (products?.length) {
    pageContent = products.map(product => {
      const inCart:boolean = cart.some(item => item.sku === product.sku)

      return (
        <Product 
          key={product.sku}
          product={product}
          dispatch={dispatch}
          REDUCE_ACTION={REDUCE_ACTION}
          inCart={inCart}
        />
      )
    })
  }

  const content = (
    <main className="main main--products">
      {pageContent}
    </main>
  )
  return (
    <div>ProductList</div>
  )
}

export default ProductList