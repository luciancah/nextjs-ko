import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
