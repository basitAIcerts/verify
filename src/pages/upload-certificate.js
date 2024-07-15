import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import DocumentsValid from '../../src/pages/documents-valid';
import Image from 'next/image';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MetaContext from '../utils/metaContext';

const UploadCertificate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [certificateNumber, setCertificateNumber] = useState(null);
    const [rendered, setRendered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);
    const [shareUrl, setShareUrl] = useState(false);
    const {certificate,setCertificate } = useContext(MetaContext);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const router = useRouter(); 
    useEffect(() => {
        if (isLoading) {
            // Simulate progress with a timer only in the UI (not ideal)
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 5 : 100));
            }, 500);

            // Clean up the interval when the component unmounts or loading is complete
            return () => clearInterval(interval);
        } else {
            setProgress(0);
        }
    }, [isLoading]);

    const handleClose = () => {
        setShow(false);
    };

    const handleVerify = async () => {
        const data = {
            id: certificateNumber
        }
        try {
            setIsLoading(true);

            const response = await fetch(`${apiUrl}/api/verify-certification-id`, {
                method: "POST",
                // @ts-ignore: Implicit any for children prop
                body: data
            });

            const responseData = await response.json();
            // Assuming response is in JSON format
            setApiData(responseData);
            setCertificate(responseData)
            setShareUrl(responseData)
        } catch (error) {
            // console.error('Error Verifying Certificate:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }

    }

    // console.log(apiData)

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

    // @ts-ignore: Implicit any for children prop
    const handleSubmit = async (event) => {
        try {
            if (certificateNumber && selectedFile) {
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
                    setCertificate(certificateData);
                    
                } else {

                    const errorData = await certificateResponse.json();
                    if(errorData.message=='Certification has revoked') {
                        router.push('/certificate-revoked')
                        return
                    }
                    // If the first API call fails, try another API call with the file
                    const formData = new FormData();
                    formData.append('pdfFile', selectedFile);

                    const fileResponse = await fetch(`${apiUrl}/api/verify`, {
                        method: "POST",
                        body: formData,
                    });
                    if (fileResponse.ok) {
                        const fileData = await fileResponse.json();
                        if (fileData.Details["Certificate Number"] === certificateNumber) {
                            setApiData(fileData);
                            setCertificate(fileData);
                        } else {
                            // Certificate Number and Certificate PDF doesn't match
                            router.push('/mismatch-certificate')
                            setLoginError("Certificate Number and Certificate PDF doesn't match")
                            setShow(true)
                        }
                    } else {
                        // Both API calls failed, handle errors
                        const errorData = await fileResponse.json();
                        if(errorData.message=='Certification has revoked') {
                            // console.log(errorData.message)
                            router.push('/certificate-revoked')
                        }
                        else if(errorData.message=='Certification is not valid') {
                            // console.log(errorData.message)
                            router.push('/invalid-certificate')
                        }
                        //failed to interact with blockchain network
                        router.push('/unable-certificate')
                        // console.error('Error during API calls:', errorData.message);
                        setLoginError(errorData.message || "Unable to verify the certification. Please review and try again.");
                        setShow(true)
                        // Handle error as needed
                    }
                }
            } else {
                // Handle error as needed
                router.push('/required-certificate')
                setLoginError("Certification Number and PDF is required")
                setShow(true)
            }
        } catch (error) {
            // console.error('Error during API calls:', error);
            router.push('/unable-certificate')
            setLoginError("Unable to verify the certification. Please review and try again.")
            setShow(true)
            // Handle error as needed
        } finally {
            setIsLoading(false);
        }
    };
    const shareTitle =  apiData?.message || "Ai Certification";

    const title = 'Ai Certificate';
    const description = 'Test description';
    const image = 'https://images.netcomlearning.com/ai-certs/cer365AllPageBg.png';


    return (

        <>
           {/* <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={certificate.details.certificateUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:url" content={certificate.details.url} />
                <meta property="og:type" content='website' />
            </Head> */}
            {apiData ? (
                <>
                    <DocumentsValid handleFileChange={handleFileChange} apiData={apiData} isLoading={isLoading} />
                </>
            ) : (
                <>
                    <div className='page-bg'>
                        <div className='position-relative h-100'>
                            <div className='vertical-center verify-cert'>
                                <div className='container-fluid'>
                                    {/* <Button className='back-btn' label='Back' /> */}
                                    <Row className="justify-content-center mt-4 verify-documents">
                                        <h1 className='title text-center'>Please upload your certification to validate.</h1>
                                        <Col md={{ span: 10 }}>
                                            <Card className='p-4'>
                                                <Row className='card-certificate '>
                                                    <Form className='form-certificate-number card-certificate'>
                                                        <Form.Group controlId="certificate-number" className='mb-3 card-certificate'>
                                                            <Form.Label className='cert-label' >Enter Certification Number:</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                className='certificate-input'
                                                                // @ts-ignore: Implicit any for children prop
                                                                value={certificateNumber}
                                                                // @ts-ignore: Implicit any for children prop
                                                                // onChange={(e) => setCertificateNumber(e.target.value)}

                                                                onChange={(e) => {
                                                                    // Get the input value
                                                                    let inputValue = e.target.value;

                                                                    // Remove spaces from the input value
                                                                    inputValue = inputValue.replace(/\s/g, '');

                                                                    // Validate alphanumeric and character limit
                                                                    if (/^[a-zA-Z0-9]*$/.test(inputValue) && inputValue.length <= 20) {
                                                                        // If input is valid, update state
                                                                        // @ts-ignore
                                                                        setCertificateNumber(inputValue);
                                                                    }
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                </Row>
                                                <div className='divider position-relative text-center'>and</div>
                                                <div className='badge-banner'>
                                                    <Image
                                                        src="/backgrounds/verify-documents.svg"
                                                        layout='fill'
                                                        objectFit='contain'
                                                        alt='Badge banner'
                                                    />
                                                </div>
                                                <Form >
                                                    <div className='d-flex flex-column align-items-center'>
                                                        {selectedFile ? (
                                                            // @ts-ignore: Implicit any for children prop
                                                            <p className="selected-file-name">{selectedFile.name}</p>
                                                        ) : (
                                                            <p className="selected-file-name">&nbsp;</p>
                                                        )}
                                                        <label htmlFor="fileInput" className="golden-upload mt-0">
                                                            Upload Certification
                                                        </label>

                                                        <input
                                                            type="file"
                                                            id="fileInput"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                            accept='.pdf'
                                                        />
                                                    </div>
                                                    <div className='information text-center'>
                                                        Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                    </div>

                                                </Form >
                                            </Card>
                                        </Col>
                                    </Row>

                                    <div className='d-flex justify-content-center mt-4'>
                                    {!selectedFile ? (
                                        <Button
                                           
                                            className={`golden rounded-0`}
                                            label='Submit'
                                            disabled
                                        />
                                    ) : (
                                        <Button
                                            className={`golden rounded-0`}
                                            label='Submit'
                                            onClick={handleSubmit}                                            
                                        />
                                    )}

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
                            </div>
                        </div>
                    </div>
                    <div className='page-footer-bg'></div>
                </>
            )}

        </>
    );
};

export default UploadCertificate;