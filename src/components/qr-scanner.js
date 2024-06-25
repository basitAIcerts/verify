// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';
import Image from 'next/image';
import QrReader from 'react-qr-scanner';

const QRScan = ({ apiData, setApiData }) => {
    const [selected, setSelected] = useState("certification verification");
    const [startScan, setStartScan] = useState(true);
    const [loadingScan, setLoadingScan] = useState(false);
    const [data, setData] = useState("");
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [show, setShow] = useState(false);
    // const [apiData, setApiData] = useState([]);

    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // useEffect to set the data when startScan changes to "Stop scan"
    useEffect(() => {
        if (startScan != false) {
            // Perform any data retrieval or processing here
            // For example, fetching data from an API or setting some default value
            setData('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startScan]);

    const handleScan = async (scanData) => {
        setLoadingScan(true);
        let scanFailed = true; // Flag to track if the scan failed
        var scanResponse = "No URL found";

        // Start a timer for 10 seconds
        // const timeout = setTimeout(() => {
        //     if (scanFailed) {
        //         // If the scan failed after 10 seconds, pass the custom URL to the API
        //         scanResponse = "Unable to detect QR, Try again with different Verification method";
        //         setLoadingScan(false);
        //         setData(scanResponse);
        //         setStartScan(false);
        //     }
        // }, 10000); // 10 seconds in milliseconds

        if (scanData) {
            try {
              const url = scanData.text;
              const paramValue = url.split('=')[1];
            //   console.log(paramValue);
                // First API call with QR Scanned data
                const qrScanResponse = await fetch(`${apiUrl}/api/decode-qr-scan`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        receivedCode: paramValue.toString(),
                    }),
                });

                // console.log(`QR data: ${paramValue}`);
                scanResponse = scanData ? paramValue : scanResponse;
                if (qrScanResponse.ok) { // Check if response is successful
                    const responseData = await qrScanResponse.json(); // Parse response body as JSON
                    // console.log("The response", responseData.data); // Do something with the response data
                    // console.log("The response", responseData?.details?.url); // Do something with the response data
                    window.location.href=responseData?.details?.url;
                    setApiData(responseData);
                    scanFailed = false;
                    // clearTimeout(timeout); // Clear the timeout if the API call succeeds before the 10-second timeout
                } else {
                    const responseData = await qrScanResponse.json(); // Parse response body as JSON
                    // console.error("The response", responseData);
                    scanFailed = true; // Set flag to true if the scan failed
                    setLoginError( responseData.message || "Unable to scan the QR. Please review and try again.")
                    setShow(true)
                }

                setData(scanResponse);
                setStartScan(false);
            } catch (error) {
                // console.error("Error during API call:", error);
                scanFailed = true; // Set flag to true if the scan failed
            }
        }
        setLoadingScan(false);
    };

    const _handleScan = async (scanData) => {
        setLoadingScan(true);
        let scanFailed = true; // Flag to track if the scan failed
        let scanResponse = "No URL found";
        let timeout;
    
        const startTimeout = () => {
            timeout = setTimeout(() => {
                if (scanFailed) {
                    // If the scan failed after 10 seconds, pass the custom URL to the API
                    scanResponse = "Unable to detect QR, Try again with different Verification method";
                    setLoadingScan(false);
                    setData(scanResponse);
                    setStartScan(false);
                }
            }, 10000); // 10 seconds in milliseconds
        };
    
        const clearExistingTimeout = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
    
        startTimeout();
    
        if (scanData) {
          const info=scanData.text;
          const paramValue = info.split('=')[1];
        //    console.log(paramValue);
            try {
                // First API call with QR Scanned data
                const qrScanResponse = await fetch(`${apiUrl}/api/verify-certification-id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: paramValue,
                    }),
                });
    
                // console.log(`QR data: ${paramValue}`);
                scanResponse = scanData ? paramValue : scanResponse;
                if (qrScanResponse.ok) { // Check if response is successful
                    const responseData = await qrScanResponse.json(); // Parse response body as JSON
                    // console.log("The response", responseData.data); // Do something with the response data
                    window.location.href=responseData?.details?.url;
                    setApiData(responseData);
                    scanFailed = false;
                } else {
                    const responseData = await qrScanResponse.json(); // Parse response body as JSON
                    // console.error("The response", responseData);
                    setLoginError(responseData.message || "Unable to scan the QR. Please review and try again.")
                    setShow(true);
                }
    
                clearExistingTimeout(); // Clear the timeout if the API call succeeds or fails
                setData(scanResponse);
                setStartScan(false);
            } catch (error) {
                // console.error("Error during API call:", error);
                clearExistingTimeout(); // Clear the timeout if there's an error during the API call
            }
        } else {
            clearExistingTimeout(); // Clear the timeout if no scan data is provided
        }
    
        setLoadingScan(false);
    };
    

    const handleClose = () => {
        setShow(false);
    };

    const handleError = (err) => {
        // console.error(err);
    };
    return (
        <div>
            <div>
                {startScan && (
                    <>
                        <div className="qr-dropdown custom-dropdown" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <select
                                onChange={(e) => setSelected(e.target.value)}>
                                <option
                                    value={"environment"}>Back Camera
                                </option>
                                <option
                                    value={"user"}>Front Camera
                                </option>
                            </select>
                            <div>
                                <QrReader
                                    facingMode={selected}
                                    delay={500}
                                    onError={handleError}
                                    onScan={handleScan}
                                    constraints={{
                                        audio: false,
                                        video: { facingMode: "environment" }
                                      }}
                                    style={{ width: "600px", height: "400px" }} // Adjust dimensions accordingly
                                />
                            </div>
                            {/* <div style={{ position: "absolute", top: "125%", left: "50%", transform: "translate(-50%, -50%)", border: "2px solid red", width: "60%", height: "100%", pointerEvents: "none" }}></div> */}
                        </div>
                    </>
                )}
                {loadingScan && <p>Loading</p>}
                {/* <div><h4>Response: {data}</h4></div> */}
            </div>
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

    );
};

export default QRScan;