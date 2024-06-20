import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Card, Modal, ProgressBar, Button, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Head from 'next/head';
import ShareButton from '../components/shareButton';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';

    // @ts-ignore: Implicit any for children prop
    const DocumentsValid = ({ handleFileChange, apiData, isLoading }) => {
        const [progress, setProgress] = useState(0);
        const certificateRef = useRef(null);
        const [certificateImage, setCertificateImage] = useState(null);
        const [shareModal, setShareModal] = useState(false);
        const [copied, setCopied] = useState(false);

        const handleClose = () => setShareModal(false);

        useEffect(() => {
            if (isLoading) {
                const interval = setInterval(() => {
                    setProgress((prevProgress) => (prevProgress < 100 ? prevProgress + 10 : 100));
                }, 500);

                return () => clearInterval(interval);
            } else {
                setProgress(0);
            }
        }, [isLoading]);

        useEffect(() => {
            if (certificateRef.current) {
                toPng(certificateRef.current)
                    .then((dataUrl) => {
                        // @ts-ignore: Implicit any for children prop
                        setCertificateImage(dataUrl);
                    })
                    .catch((error) => {
                        console.error('Error generating certificate image:', error);
                    });
            }
        }, [apiData]);

        const handleLogoClick = () => {
            window.location.reload();
        };

        const { message, Details } = apiData || {};

        const shareValue = apiData.Details["Polygon URL"];

        const copyToClipboard = () => {
            navigator.clipboard.writeText(shareValue).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 3000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        // @ts-ignore: Implicit any for children prop
        const formatDate = (dateString) => {
            if (!dateString) return '';

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();

            return `${month}/${day}/${year}`;
        };

        const shareUrl = Details?.url;
        const shareTitle = "Aicerts Certification";
        const shareDescription = "Aicerts Certification details.";
        const shareImage = "/backgrounds/certificate_template_1.png";

        return (
            <>
            
                {/* <Head>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={shareTitle} />
                    <meta property="og:description" content={shareDescription} />
                    <meta property="og:image" content={"/backgrounds/certificate_template_1.png"} />
                    <meta property="og:url" content={shareUrl} />
                    <meta property="og:image:type" content="image/png" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={shareTitle} />
                    <meta name="twitter:description" content={shareDescription} />
                    <meta name="twitter:image" content={"/backgrounds/certificate_template_1.png"} />
                    <title>{shareTitle}</title>
                    <meta name="description" content={shareDescription} />
                </Head> */}

                <div className='page-bg'>
                    <div className='position-relative h-100'>
                        <div className='vertical-center verify-cert'>
                            <div className='container-fluid'>
                                <Row className="justify-content-center mt-4 verify-documents">
                                    <h1 className='title text-center'>Your Certificate is Verified and is Valid.</h1>
                                    <Col xs={{ span: 12 }} md={{ span: 10 }}>
                                        <Card className='p-0 p-md-4'>
                                            <Row className='justify-content-center'>
                                                <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                                    {Details ? (
                                                        <>
                                                            <Card ref={certificateRef} className='valid-cerficate-info'>
                                                                <Card className='dark-card position-relative'>
                                                                    <div className='d-block d-lg-flex align-items-center certificate-internal-info'>
                                                                        <div className='badge-banner'>
                                                                            <Image
                                                                                src="/backgrounds/varified-certificate-badge.gif"
                                                                                layout='fill'
                                                                                objectFit='contain'
                                                                                alt='Badge Banner'
                                                                            />
                                                                        </div>
                                                                        <div className='info'>
                                                                            <div className='hash-data'>#198754</div>
                                                                            <h4 className='cert-title'>{Details['Course Name'] ? Details['Course Name'] : Details['Certification Name'] || Details['course']}</h4>
                                                                        </div>
                                                                        {/* <div className='hash-info'>
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
                                                                        </div> */}
                                                                    </div>
                                                                </Card>

                                                                <div className='cerficate-external-info d-block d-lg-flex justify-content-between align-items-center text-md-left text-center mb-md-0 mb-4'>
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
                                                            <div className='share-cert text-center'>
                                                                <div className='hero-title'>Share your certificate:</div>
                                                                <div className='d-flex align-items-center justify-content-center'>
                                                                    <div className='share-icon' onClick={() => setShareModal(true)}>
                                                                        <Image
                                                                            src='/icons/facebook-share.svg'
                                                                            width={20}
                                                                            height={20}
                                                                            alt='Facebook Share'
                                                                        />
                                                                    </div>
                                                                    <div className='share-icon' onClick={() => setShareModal(true)}>
                                                                        <Image
                                                                            src='/icons/linkedin-share.svg'
                                                                            width={20}
                                                                            height={20}
                                                                            alt='Facebook Share'
                                                                        />
                                                                    </div>
                                                                    <div className='share-icon' onClick={() => setShareModal(true)}>
                                                                        <Image
                                                                            src='/icons/twitter-share.svg'
                                                                            width={20}
                                                                            height={20}
                                                                            alt='Facebook Share'
                                                                        />
                                                                    </div>
                                                                    <div className='share-icon' onClick={() => setShareModal(true)}>
                                                                        <Image
                                                                            src='/icons/diskette-share.svg'
                                                                            width={20}
                                                                            height={20}
                                                                            alt='Facebook Share'
                                                                        />
                                                                    </div>
                                                                    <div className='share-icon' onClick={() => setShareModal(true)}>
                                                                        <Image
                                                                            src='/icons/link-share.svg'
                                                                            width={20}
                                                                            height={20}
                                                                            alt='Facebook Share'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Form className='p-4 p-md-0'>
                                                                <div className='d-flex justify-content-center align-items-center'>
                                                                    <Link href="/" onClick={handleLogoClick} className="golden-upload valid-again">Upload Again</Link>
                                                                </div>
                                                                <div className='information text-center'>
                                                                    Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                                </div>
                                                            </Form>
                                                            {/* <div className='d-flex justify-content-center align-items-center mt-4'>
                                                                <FacebookShareButton url={shareUrl} title={shareTitle} className='mr-2'>
                                                                    <FacebookIcon size={32} round />
                                                                </FacebookShareButton>
                                                                <TwitterShareButton url={shareUrl} title={shareTitle} className='mr-2'>
                                                                    <TwitterIcon size={32} round />
                                                                </TwitterShareButton>
                                                                <LinkedinShareButton url={shareUrl} title={shareTitle} className='mr-2'>
                                                                    <LinkedinIcon size={32} round />
                                                                </LinkedinShareButton>
                                                            </div> */}
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
                                                            <Form>
                                                                <div className='d-flex justify-content-center align-items-center'>
                                                                    <label htmlFor="fileInput" className="golden-upload">Validate again</label>
                                                                    <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                                                                </div>
                                                                <div className='information text-center pb-md-0 pb-4'>
                                                                    Only <strong>PDF</strong> is supported. <br /> (Upto 2 MB)
                                                                </div>
                                                            </Form>
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

                <Modal className='loader-modal share-link' show={shareModal} onHide={handleClose} centered>
                    <Modal.Header>
                        <Modal.Title>Share</Modal.Title>
                        <div onClick={handleClose} style={{ cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <g clipPath="url(#clip0_3904_8458)">
                                    <path d="M15 0C6.72867 0 0 6.72867 0 15C0 23.2713 6.72867 30 15 30C23.2713 30 30 23.2713 30 15C30 6.72867 23.2713 0 15 0ZM20.5238 18.7562C21.0125 19.2451 21.0125 20.0349 20.5238 20.5238C20.2801 20.7676 19.9601 20.89 19.6399 20.89C19.3199 20.89 18.9999 20.7676 18.7562 20.5238L15 16.7674L11.2438 20.5238C11.0001 20.7676 10.6801 20.89 10.3601 20.89C10.0399 20.89 9.71992 20.7676 9.47617 20.5238C8.9875 20.0349 8.9875 19.2451 9.47617 18.7562L13.2326 15L9.47617 11.2438C8.9875 10.7549 8.9875 9.96506 9.47617 9.47617C9.96506 8.9875 10.7549 8.9875 11.2438 9.47617L15 13.2326L18.7562 9.47617C19.2451 8.9875 20.0349 8.9875 20.5238 9.47617C21.0125 9.96506 21.0125 10.7549 20.5238 11.2438L16.7674 15L20.5238 18.7562Z" fill="#A2A2A2"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_3904_8458">
                                    <rect width="30" height="30" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label htmlFor="shareLink" className='d-block'>Please copy the link to share.</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                id="shareLink"
                                className='rounded-0'
                                value={shareValue}
                                aria-describedby="copy-url"
                            />
                            {copied ? (
                               <InputGroup.Text id="copy-url">
                                    <svg fill="#247307" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon points="452.253,28.326 197.831,394.674 29.044,256.875 0,292.469 207.253,461.674 490,54.528 "></polygon> </g></svg>
                                </InputGroup.Text>
                            ):(
                                <InputGroup.Text id="copy-url" onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                        <g clipPath="url(#clip0_3975_5052)">
                                            <path d="M15.793 26H6.09375C3.85362 26 2.03125 24.1776 2.03125 21.9375V8.17578C2.03125 5.93565 3.85362 4.11328 6.09375 4.11328H15.793C18.0331 4.11328 19.8555 5.93565 19.8555 8.17578V21.9375C19.8555 24.1776 18.0331 26 15.793 26ZM6.09375 6.14453C4.97379 6.14453 4.0625 7.05582 4.0625 8.17578V21.9375C4.0625 23.0575 4.97379 23.9688 6.09375 23.9688H15.793C16.9129 23.9688 17.8242 23.0575 17.8242 21.9375V8.17578C17.8242 7.05582 16.9129 6.14453 15.793 6.14453H6.09375ZM23.918 19.3984V4.0625C23.918 1.82237 22.0956 0 19.8555 0H8.58203C8.02106 0 7.56641 0.454651 7.56641 1.01562C7.56641 1.5766 8.02106 2.03125 8.58203 2.03125H19.8555C20.9754 2.03125 21.8867 2.94254 21.8867 4.0625V19.3984C21.8867 19.9594 22.3414 20.4141 22.9023 20.4141C23.4633 20.4141 23.918 19.9594 23.918 19.3984Z" fill="#5B5A5F"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3975_5052">
                                            <rect width="26" height="26" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </InputGroup.Text>
                            )}
                            
                        </InputGroup>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    export default DocumentsValid;
