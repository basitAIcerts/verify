import React, { useState } from 'react';
import Navigation from '@/app/navigation';
import { Form, Row, Col, Card, Modal, ProgressBar } from 'react-bootstrap';
import Image from 'next/image';
import Button from '../../shared/button/button';
import { useRouter } from 'next/router';


const InvalidCertificate = () => {
    const router = useRouter();

    const handleUploadRedirect = () => {
        router.push('/');
    }
    const handlebackRedirect = () => {
        router.push('/verify-documents');
    }

    return (
        <>
            <Navigation />
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center verify-cert'>
                        <div className='container-fluid'>
                            <Button className='back-btn' label='Back' onClick={handlebackRedirect} />
                            <Row className="justify-content-center mt-4 verify-documents">
                                <h1 className='title text-center'>Your Certification is Invalid.</h1>
                                <Col md={{ span: 10 }}>
                                    <Card className='p-4'>
                                        <div className='badge-banner'>
                                            <Image
                                                src="/icons/invalid-certificate.gif"
                                                layout='fill'
                                                objectFit='contain'
                                                alt='Badge banner'
                                            />
                                        </div>
                                        <Form >
                                            <div className='d-flex flex-column align-items-center'>                                                
                                                <Button className="golden-upload" label='Upload again' onClick={handleUploadRedirect} />
                                            </div>
                                            <div className='information text-center'>
                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                            </div>
                                        </Form >
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>
        </>
    );
}

export default InvalidCertificate;
