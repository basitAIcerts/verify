import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
// import Head from 'next/head';
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';

    const shareTitle = "Aicerts Certification";
    const shareDescription = "Aicerts Certification details.";
    const shareImage = "/backgrounds/certificate_template_1.png";
  
  return (
    <>
     {/* <Head>
        <title>Test title</title>
          <meta name="description" content='Test description' />
          <meta property="og:title" content='Test title' />
          <meta property="og:description" content='Test description' />
          <meta property="og:image" content="https://img.freepik.com/free-vector/gradient-car-rental-social-media-post-template_23-2149228183.jpg" />
          <meta property="og:url" content='https://nextjs.org/learn/' />
          <meta property="og:type" content="website" />
      </Head> */}
      <Component {...pageProps} router={router} />
    </>
  );
};

export default App;
