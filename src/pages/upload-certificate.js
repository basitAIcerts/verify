import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import DocumentsValid from '../../src/pages/documents-valid';
import Image from 'next/image';
import certificate from "../services/certificateServices";

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

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;


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

        } catch (error) {
            console.error('Error Verifying Certificate:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }

    }
    
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
                } else {
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
                        } else {
                            setLoginError("Certificate Number and Certificate PDF doesnt match")
                            setShow(true)
                        }
                    } else {
                        // Both API calls failed, handle errors
                        console.error('Error in both API calls');
                        setLoginError("Error in Verifying certificate")
                        setShow(true)
                        // Handle error as needed
                    }
                }
            } else {
                // Handle the case where either certificateNumber or selectedFile is missing
                console.error('Both certificateNumber and selectedFile are required');
                // Handle error as needed
                setLoginError("Certification Number and PDF is required")
                setShow(true)
            }
        } catch (error) {
            console.error('Error during API calls:', error);
            setLoginError("Error in Verifying certificate")
            setShow(true)
            // Handle error as needed
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Extract encrypted link from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const qValue = urlParams.get('q');
        const ivValue = urlParams.get('iv');

        if (qValue && ivValue) {
            handleVerifyCertificate(qValue, ivValue);
            setRendered(true)
        } else {
            setRendered(true)
        }
    }, []);

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
                    console.error('Verification failed!', response.error);
                }
            } else {
                console.error('Verification failed!', response.error);
            }


            setIsLoading(false);
        });
    };

    if (!rendered) {
        return (
            <></>
        );
    }

    return (

        <>
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
                                                        {selectedFile &&
                                                            // @ts-ignore: Implicit any for children prop
                                                            <p className="selected-file-name">{selectedFile.name}</p>
                                                        }
                                                        <label htmlFor="fileInput" className="golden-upload">
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
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <label 
                                                            onClick={handleSubmit} 
                                                            className={`golden-upload-cert ${selectedFile ? 'has-file' : ''}`}
                                                        >
                                                            Verify
                                                        </label>
                                                    </div>

                                                </Form >
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Modal for loading */}
                                    <Modal className='loader-modal' show={isLoading} centered>
                                        <Modal.Body>
                                            <div className='certificate-loader'>
                                                <Image
                                                    src="/backgrounds/certification-loader.gif"
                                                    layout='fill'
                                                    objectFit='contain'
                                                    alt='Loader'
                                                />
                                            </div>
                                            <ProgressBar now={progress} label={`${progress}%`} />
                                        </Modal.Body>
                                    </Modal>

                                    <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                                        <Modal.Body className='p-5'>
                                            {loginError !== '' ? (
                                                <>
                                                    <div className='error-icon'>
                                                        <Image
                                                            src="/icons/close.svg"
                                                            layout='fill'
                                                            objectFit='contain'
                                                            alt='Loader'
                                                        />
                                                    </div>
                                                    <h3 style={{ color: 'red' }}>{loginError}</h3>
                                                    <button className='warning' onClick={handleClose}>Ok</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='error-icon'>
                                                        <Image
                                                            src="/icons/check-mark.svg"
                                                            layout='fill'
                                                            objectFit='contain'
                                                            alt='Loader'
                                                        />
                                                    </div>
                                                    <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
                                                    <button className='success' onClick={handleClose}>Ok</button>
                                                </>
                                            )}


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