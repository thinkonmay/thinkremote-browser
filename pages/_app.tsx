import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthProvider } from "../context/authContext";


function MyApp({ Component, pageProps }: AppProps) {
    return(
    <AuthProvider>
        <Head>
            <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
            />
        </Head>
        <Component {...pageProps} />;
    </AuthProvider>
    )
}

export default MyApp;
