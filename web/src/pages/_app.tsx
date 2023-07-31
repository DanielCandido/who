import "./globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import RootLayout from "./layout";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
};

export default App;
