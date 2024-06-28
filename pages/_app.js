import Head from 'next/head';
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SoundProvider } from '../components/SoundContext'; // Update the path to SoundContext

function MyApp({ Component, pageProps }) {
  return (
    <SoundProvider>
      <>
        <Head>
          <meta name="viewport" content="width=375, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>
        <Component {...pageProps} />
        <Analytics/>
      </>
    </SoundProvider>
  );
}

export default MyApp;