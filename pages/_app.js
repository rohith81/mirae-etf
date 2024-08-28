import "@/styles/globals.css";
import "@/styles/custom.css";
import Head from "next/head";
import Header from "@/components/header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Mirae Asset ETF</title>
        <link rel="icon" href="/favicon.png"/>
      </Head>
      <Header/>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
