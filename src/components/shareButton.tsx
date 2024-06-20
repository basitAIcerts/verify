import { useEffect } from 'react';

interface ShareButtonProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, description, image, url }) => {
  useEffect(() => {
    // Load the Facebook SDK asynchronously
    const loadFacebookSDK = () => {
      // Check if FB object is already initialized
      if (window.FB) {
        window.FB.XFBML.parse();
        return;
      }

      // Create and append the Facebook SDK script
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.onload = () => {
        window.FB.init({
          appId: '1191022229004457', // Replace with your Facebook app ID if you have one
          xfbml: true,
          version: 'v3.0',
        });
        window.FB.XFBML.parse();
      };
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

   // Validate URL function
   const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Function to share on Facebook
  const shareOnFacebook = () => {
    if (!window.FB) return;

    // Validate the URL before sharing
    if (!isValidUrl(url)) {
      console.error('Invalid URL:', url);
      return;
    }

     window.FB.ui({
      method: 'share',
      href: url,
      quote: `${title} - ${description} - ${image}`,
      hashtag: '#Example',
    }, (response: any) => {
      // Callback function
      console.log(response);
    });
  };

  return (
    <div>
      {/* Share button */}
      <button onClick={shareOnFacebook}>Share on Facebook</button>
    </div>
  );
};

export default ShareButton;
