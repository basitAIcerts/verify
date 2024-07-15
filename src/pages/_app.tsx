import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MetaContext from "../utils/metaContext"
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';

    const shareTitle = "Aicerts Certification";
    const shareDescription = "Aicerts Certification details.";
    const shareImage = "https://images.netcomlearning.com/ai-certs/cer365AllPageBg.png";
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGE;
    const [certificate, setCertificate]=useState({
      message:"",
      details:{
        certificateUrl:"",
        url:""
      }
    })

    useEffect(()=>{

    },[])
  return (
    // @ts-ignore: Implicit any for children prop
    <MetaContext.Provider value={{certificate, setCertificate:setCertificate}}>
      
      <Head>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={shareTitle} />
                <meta property="og:description" content={shareDescription} />
                <meta property="og:image" content={certificate.details.certificateUrl} />
                <meta property="og:image:secure_url" content={certificate.details.certificateUrl} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={shareTitle} />
                <meta name="twitter:description" content={shareDescription} />
                <meta name="twitter:image" content={certificate.details.certificateUrl} />
                <title>{shareTitle}</title>
                <meta name="description" content={shareDescription} />
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
            </Head>
      <Component {...pageProps} router={router} />
      </MetaContext.Provider>
  );
};

export default App;
