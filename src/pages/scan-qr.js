import React, { useState } from 'react';
import Navigation from '@/app/navigation';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';
import Button from '../../shared/button/button'
import { useRouter } from 'next/router';

const ScanDocuments = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/verify-documents");
    }

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
                                        <div className='badge-banner'>
                                            <Image
                                                src="/icons/scan-qr-badge.svg"
                                                layout='fill'
                                                objectFit='contain'
                                                alt='Badge banner'
                                            />
                                        </div>
                                        <Form >
                                            <div className='d-flex flex-column align-items-center'>                                                
                                                <Button className="golden-upload scan-qr" label='Open Camera to Scan' />
                                            </div>
                                            <div className='information text-center'>
                                                Your default camera will open, please keep your certificate ready.
                                            </div>
                                        </Form >
                                    </Card>
                                </Col>
                            </Row>
                            <div className='text-center mt-4'>
                                <p><strong><i>or</i></strong></p>
                                <Button className='upload cert rounded-0' label="Upload Certificate" onClick={handleClick} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>
        </>
    );
}

export default ScanDocuments;
