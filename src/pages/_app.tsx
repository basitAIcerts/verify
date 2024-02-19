import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  
  return (
    <>
      <Component {...pageProps} router={router} />
    </>
  );
};

export default App;
