import React, { useEffect, useState } from 'react';
import Navigation from '@/app/navigation';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';
import QRScan from '../components/qr-scanner';
import QrReader from '@/components/QrReader';

const ScanDocuments = () => {
    const [apiData, setApiData] = useState(null);
    const [scannerActive, setScannerActive] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        router.push("/verify-documents");
    };

    const toggleScanner = () => {
        setScannerActive(!scannerActive);
    };

    useEffect(() => {
        console.log('apiData', apiData);
    }, [apiData]);


    return (
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
                                                <QrReader apiData={apiData} setApiData={toggleScanner} />
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
            </div>
            <div className='page-footer-bg'></div>
        </>
    );
};

export default ScanDocuments;
