// pages/_app.js
import Head from 'next/head';
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/react"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=375, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
      <Analytics/>
    </>
  );
}

export default MyApp;
