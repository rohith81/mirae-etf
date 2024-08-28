import Header from "@/components/header";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <title>Mirae Asset ETF</title>
      <link rel="icon" href="/favicon.png"/>
      </Head>
      <body>
        <Header/>
        <main>
          <Main />
        </main>
        <NextScript />
      </body>
    </Html>
  );
}
