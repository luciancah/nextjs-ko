import { AppProps } from 'next/app'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-5ZM6QTQJW5" />
    </>
  )
}
