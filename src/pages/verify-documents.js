import React, { useEffect, useState} from 'react';
import UploadCertificate from './upload-certificate';
import Navigation from '@/app/navigation';
import Head from 'next/head';
import { useContext } from 'react';
import MetaContext from "../utils/metaContext"
const VerifyDocuments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState({
        message: "",
        detailsQR: {}
    });
    const {certificate } = useContext(MetaContext);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // @ts-ignore: Implicit any for children prop
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (selectedFile) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);

                const response = await fetch(`${apiUrl}/api/verify`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json(); // Assuming response is in JSON format
                setApiData(responseData);

            } catch (error) {
                // console.error('Error uploading file:', error);
                // Handle error
            } finally {
                setIsLoading(false);
            }
        }
    };

    const title = 'Ai Certificate';
    const description = 'Test description';
    const image = 'https://images.netcomlearning.com/ai-certs/cer365AllPageBg.png';


    useEffect(()=>{
console.log(apiData,"data")
    },[apiData])
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={certificate?.details?.url} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:url" content={certificate?.details?.url} />
                <meta property="og:type" content='website' />
            </Head>
            <Navigation />
            <UploadCertificate
            // @ts-ignore: Implicit any for children prop
                handleFileChange={handleFileChange}
                isLoading={isLoading}
                apiUrl={apiUrl}
                setApiData={setApiData}
                apiDataVerify={apiData}
            />
        </div>
    );
}

export default VerifyDocuments;
