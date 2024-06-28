// Define a configuration object for the server
export const serverConfig = {
    // Retrieve the app server URL from the environment variable NEXT_PUBLIC_BASE_URL
    appServerUrl: process.env.NEXT_PUBLIC_BASE_URL_USER,
    ALLOW_ORIGIN: process.env.NEXT_PUBLIC_ALLOW_ORIGIN || "*",
    ALLOW_METHODS: process.env.NEXT_PUBLIC_ALLOW_METHODS || "*",
    // other configurations...
 };
  

