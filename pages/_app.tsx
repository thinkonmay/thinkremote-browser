import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Home from '.'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
  // return <Home></Home>
}

export default MyApp
