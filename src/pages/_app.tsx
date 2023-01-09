import Image from "next/image"
import type { AppProps } from 'next/app'

import { globalStyles } from '../styles/global'
import { Container, Header } from '../styles/pages/app'

import logoImg from '../assets/logo.svg'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image 
          src={logoImg.src} 
          height={52} 
          width={130} 
          alt="" 
        />
      </Header>

      <Component {...pageProps} />
    </Container>
  )
}
