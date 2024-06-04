import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button } from 'react-bootstrap';
import Link from 'next/link';
import { toPng } from 'html-to-image';
// import { saveAs } from 'file-saver';

// @ts-ignore: Implicit any for children prop
const DocumentsValid = ({ handleFileChange, apiData, isLoading }) => {
    const [progress, setProgress] = useState(0);
    const certificateRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            // Simulate progress with a timer
            const interval = setInterval(() => {
                // Update the progress (you can replace this with your API logic)
                setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 10 : 100));
            }, 500);

            // Clean up the interval when the component unmounts or loading is complete
            return () => clearInterval(interval);
        } else {
            // Reset the progress when loading is complete
            setProgress(0);
        }
    }, [isLoading]);

    const handleLogoClick = () => {
        window.location.reload(); // Reload the page
    };

    const handleShare = async () => {
        if (certificateRef.current) {
            try {
                const dataUrl = await toPng(certificateRef.current);
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'certificate.png', { type: blob.type });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: 'Certification',
                        text: 'Check out my certification!'
                    });
                } else {
                    // Fallback: save the image locally
                    // saveAs(blob, 'certificate.png');
                }
            } catch (error) {
                console.error('Error sharing the certificate:', error);
            }
        }
    };

    if (!apiData) {
        return <></>;
    }

    const { message, Details } = apiData;

    /**
     * Formats a date string in 'mm/dd/yyyy' format.
     * @param {string | undefined} dateString The date string to format.
     * @returns {string} The formatted date string.
     */
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle empty or undefined date string

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings

        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center verify-cert'>
                        <div className='container-fluid'>
                            <Row className="justify-content-center mt-4 verify-documents">
                                <h1 className='title text-center'>{message.replace('Certificate', 'Certification')}</h1>
                                <Col xs={{ span: 12 }} md={{ span: 10 }}>
                                    <Card className='p-0 p-md-4'>
                                        <Row className='justify-content-center'>
                                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                                {Details ? (
                                                    <>
                                                        <Card ref={certificateRef} className='valid-cerficate-info'>
                                                            <Card className='dark-card position-relative'>
                                                                <div className='d-block d-lg-flex justify-content-between align-items-center certificate-internal-info'>
                                                                    <div className='badge-banner'>
                                                                        <Image
                                                                            src="/backgrounds/varified-certificate-badge.gif"
                                                                            layout='fill'
                                                                            objectFit='contain'
                                                                            alt='Badge Banner'
                                                                        />
                                                                    </div>
                                                                    <div className='hash-info'>
                                                                        <Row className='position-relative'>
                                                                            <Col className='border-right' xs={{ span: 12 }} md={{ span: 6 }}>
                                                                                <div className='hash-title'>Certification Number</div>
                                                                                <div className='hash-info'>{Details['Certificate Number'] ? Details['Certificate Number'] : Details['Certification Number'] || Details['certificateNumber']}</div>
                                                                            </Col>
                                                                            <Col xs={{ span: 12 }} md={{ span: 6 }}>
                                                                                <div className='hash-title'>Certification Name</div>
                                                                                <div className='hash-info'>{Details['Course Name'] ? Details['Course Name'] : Details['Certification Name'] || Details['course']}</div>
                                                                            </Col>
                                                                            <hr />
                                                                            <hr className='vertical-line' />
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            </Card>

                                                            <div className='cerficate-external-info d-block d-lg-flex justify-content-between align-items-center text-md-left text-center mb-md-0 mb-4  '>
                                                                <div className='details'>
                                                                    <div className='heading'>Name</div>
                                                                    <div className='heading-info'>{Details['Name'] || Details['name']}</div>
                                                                </div>
                                                                <div className='details'>
                                                                    <div className='heading'>Grant Date</div>
                                                                    <div className='heading-info'>{formatDate(Details['Grant Date'] || Details['grantDate'])}</div>
                                                                </div>
                                                                <div className='details'>
                                                                    <div className='heading'>Expiration Date</div>
                                                                    <div className='heading-info'>
                                                                        {/* {formatDate(Details['Expiration Date'] || Details['expirationDate']) || 'No Expiration Date available'} */}
                                                                        {Details['Expiration Date'] === "1" || Details['expirationDate'] === "1" ? "-" : formatDate(Details['Expiration Date'] || Details['expirationDate']) || 'No Expiration Date available'}
                                                                    </div>
                                                                </div>

                                                                <div className='details varification-info'>
                                                                    <Button href={Details['Polygon URL'] ? Details['Polygon URL'] : Details['Verify On Blockchain']} target="_blank" className='heading-info' variant="primary">
                                                                        Verify on Blockchain
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                        <Form className='p-4 p-md-0'>
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                {/* Custom button */}
                                                                <Link href="/" onClick={handleLogoClick} className="golden-upload valid-again">Validate Another</Link>
                                                            </div>
                                                            <div className='information text-center'>
                                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                            </div>
                                                        </Form >
                                                        <div className='d-flex justify-content-center align-items-center mt-4'>
                                                            <Button onClick={handleShare} className='heading-info' variant="primary">
                                                                Share Certificate
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='badge-banner'>
                                                            <Image
                                                                src="/backgrounds/invalid-certificate.gif"
                                                                layout='fill'
                                                                objectFit='contain'
                                                                alt='Badge Banner'
                                                            />
                                                        </div>
                                                        <Form >
                                                            <div className='d-flex justify-content-center align-items-center'>
                                                                {/* Custom button */}
                                                                <label htmlFor="fileInput" className="golden-upload">
                                                                    Validate again
                                                                </label>

                                                                {/* File input with an event listener to update the label */}
                                                                <input
                                                                    type="file"
                                                                    id="fileInput"
                                                                    style={{ display: 'none' }}
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <div className='information text-center pb-md-0 pb-4'>
                                                                Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                            </div>
                                                        </Form >
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>

            {/* Loading Modal for API call */}
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
                    <ProgressBar now={progress} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DocumentsValid;
