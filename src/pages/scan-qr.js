import React, { useEffect, useState } from 'react';
import Navigation from '@/app/navigation';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import QrReader from '@/components/QrReader';
import DocumentsValid from '../../src/pages/documents-valid';
import certificate from '@/services/certificateServices';
const ScanDocuments = () => {
    const [apiData, setApiData] = useState(null);
    const [scannerActive, setScannerActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [rendered, setRendered] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleClick = () => {
        router.push("/verify-documents");
    };

    const toggleScanner = () => {
        setScannerActive(!scannerActive);
    };

  

    useEffect(() => {
        // Extract encrypted link from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const qValue = urlParams.get('q');
        const ivValue = urlParams.get('iv');

        if (qValue && ivValue) {
            handleVerifyCertificate(qValue, ivValue);
            setRendered(true);
        } else {
            // Extract the certificate number from the URL if present
            const url = window.location.href;
            const match = url.match(/=(\w+)/);
            if (match) {
                const certificateNumber = match[1]; // Extract number after '='
                verifyUrl(certificateNumber);
            }
            setRendered(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

        // @ts-ignore: Implicit any for children prop
        const verifyUrl = async (certificateNumber) => {
            try {
                if (certificateNumber) {
                    setIsLoading(true);
    
                    // First API call with certificateNumber
                    const certificateResponse = await fetch(`${apiUrl}/api/verify-certification-id`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: certificateNumber,
                        }),
                    });
    
                    if (certificateResponse.ok) {
                        const certificateData = await certificateResponse.json();
                        // Assuming response is in JSON format
                        setApiData({
                            // @ts-ignore: Implicit any for children prop
                            Details: certificateData?.details,
                            message: certificateData?.message
                        });
                    }
                    else{
                        const errorData = await certificateResponse.json();
                        if(errorData.message=='Certification has revoked') {
                            router.push('/certificate-revoked')
                            return
                        }
                    }
                } else {
                   
                    // Handle error as needed
                    setLoginError("Certification Number and PDF is required")
                    setShow(true)
                }
            } catch (error) {
                // console.error('Error during API calls:', error);
                setLoginError("Unable to verify the certification. Please review and try again.")
                setShow(true)
                // Handle error as needed
            } finally {
                setIsLoading(false);
            }
        };

    // @ts-ignore: Implicit any for children prop
    const handleVerifyCertificate = (qValue, ivValue) => {
        // Call the verify API with the encrypted link
        const data = {
            qValue, ivValue
        }
        setIsLoading(true)

        certificate?.verifyCertificate(data, (response) => {
            // Handle the API response here (success or error)

            if (response.status == "SUCCESS") {
                if (response.data.status === 'PASSED') {
                    // @ts-ignore: Implicit any for children prop
                    setApiData((prevData) => {
                        // Perform actions based on prevData and update state
                        return {
                            message: "Certificate is Valid",
                            Details: response.data.data
                        };
                    });

                    // @ts-ignore: Implicit any for children prop
                    setData(response.data.data)

                    setIsLoading(false)

                } else if (response.data.status === 'FAILED') {
                    // @ts-ignore: Implicit any for children prop
                    setApiData((prevData) => {
                        // Perform actions based on prevData and update state
                        return {
                            message: "Certificate is not Valid",
                        };
                    });
                    setIsLoading(false)
                } else {
                    // Handle verification error
                    // console.error('Verification failed!', response.error);
                }
            } else {
                // console.error('Verification failed!', response.error);
            }


            setIsLoading(false);
        });
    };

      // @ts-ignore: Implicit any for children prop
      const handleFileChange = async (event) => {
        // setSelectedFile(event.target.files[0]);

        const file = event.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

        if (file && file.size > maxSize) {
            // File size exceeds the maximum allowed size
            alert("File size exceeds 2MB limit. Please select a smaller file.");
            setSelectedFile(null); // Clear the selected file
        } else {
            // File size is within the limit, proceed with the upload
            setSelectedFile(file);
        }
    }

    return (
        <>
        {apiData ? (
            <>
                <DocumentsValid handleFileChange={handleFileChange} apiData={apiData} isLoading={isLoading} />
            </>
        ) : (
        <>
            {/* <Navigation /> */}
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center verify-cert'>
                        <div className='container-fluid'>
                            <Row className="justify-content-center mt-4 verify-documents">
                                <h1 className='title text-center'>Scan your certificate to validate.</h1>
                                <Col md={{ span: 10 }}>
                                    <Card className='p-4'>
                                        {!scannerActive ? (
                                            <div className='badge-banner'>
                                                <Image
                                                    src="/icons/scan-qr-badge.svg"
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt='Badge banner'
                                                />
                                            </div>
                                        ) : (
                                            <div className='d-flex flex-column align-items-center'>
                                                <QrReader apiData={apiData} setApiData={setApiData} />
                                            </div>
                                        )}
                                        {/* {scannerActive && <QrReader />} */}
                                         <div className='text-center'>
                                            <Button
                                                className="golden-upload scan-qr p-[14px] gap-[10px]" 
                                                label={scannerActive ? 'Stop Scan' : 'Open Camera to Scan'}
                                                onClick={toggleScanner}
                                            />
                                        </div>
                                        <Form>      
                                            <div className='information text-center'>
                                                Your default camera will open, please keep your certificate ready.
                                            </div>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                            <div className='text-center mt-4'>
                                <p><strong><i>or</i></strong></p>

                                <Button
                                className='w-[256px] h-[50px] p-[14px] gap-[10px] border-t-2 border-r-0 border-b-0 border-l-0 border-[#CFA935] opacity-1 rounded-0 upload cert'
                                label="Upload Certificate"
                                onClick={handleClick}
                            />

                            </div>
                            
                        </div>
                    </div>
                </div>
                
                <Modal className='loader-modal' show={isLoading} centered>
                                        <Modal.Body>
                                            <div className='certificate-loader'>
                                                <Image
                                                    src="/backgrounds/verification.gif"
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt='Loader'
                                                />
                                            </div>
                                            <div className='text'>Verification In Progress</div>
                                            <ProgressBar now={progress} label={`${progress}%`} />
                                        </Modal.Body>
                                    </Modal>

            </div>
            <div className='page-footer-bg'></div>
        </>
                                    )}
                                    </>
    );
};

export default ScanDocuments;
