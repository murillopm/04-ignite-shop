import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useState } from "react"
import Stripe from "stripe"

import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface Productprops {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: Productprops) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
  
  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)
      
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl
    } catch (error) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout')
    }
  }
  
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_N8iHydbov2Pyi8' } }
    ],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id ?? ''

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })
  
  const { id: defaultPriceId, unit_amount } = product.default_price as Stripe.Price
  let price = null;

  if (unit_amount !== null) {
    price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(unit_amount / 100)
  }
  
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.images[0],
        price,
        defaultPriceId,
      }
    },
    revalidate: 60 * 60,
  }
}