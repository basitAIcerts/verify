import { FacebookShareButton, FacebookIcon } from 'react-share';
import Head from 'next/head';

const Share = () => {
    const shareUrl = 'http://10.2.3.57:8060/';
    const title = 'My Page Title';
    const description = 'This is a description of my page.';
    const imageUrl = 'http://10.2.3.57:8060/bg/rag-bot-bg.svg';
  
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:url" content={shareUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="My Website" />
          <meta property="og:locale" content="en_US" />
          {/* Add Twitter Card meta tags if sharing on Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@yourtwitterhandle" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={imageUrl} />
        </Head>
        <div>
          <h1>Welcome to My Page</h1>
          {/* Page content goes here */}
          <FacebookShareButton url={shareUrl} quote={title} hashtag="#myhashtag">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </>
    );
}

export default Share;
