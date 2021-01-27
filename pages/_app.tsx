import { DokzProvider, GithubLink, ColorModeSwitch } from "dokz";
import React from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import "mini-graphiql/dist/style.css";

export default function App(props) {
  const { Component, pageProps } = props;
  return (
    <ChakraProvider resetCSS>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Fira+Code"
          rel="stylesheet"
          key="google-font-Fira"
        />
      </Head>
      <DokzProvider
        headerLogo={
          <img src="/aavewatch.svg" style={{ opacity: 0.8 }} height="100px" />
        }
        docsRootPath="pages/docs"
        headerItems={[
          <GithubLink
            key="0"
            url="https://github.com/sakulstra/community-aave-api"
          />,
          <ColorModeSwitch key="1" />,
        ]}
        sidebarOrdering={{
          "index.mdx": true,
          api: false,
          API: {
            "index.mdx": true,
            "income.mdx": true,
          },
        }}
      >
        <Component {...pageProps} />
      </DokzProvider>
    </ChakraProvider>
  );
}
