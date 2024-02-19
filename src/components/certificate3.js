import React, { useState } from 'react';
import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import { Modal } from 'react-bootstrap';

const CertificateTemplateThree = ({ certificateData }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!certificateData || !certificateData.details) {
        // If certificateData is null or does not have details, return null or display an error message
        return <p>Error: Certificate data not available.</p>;
    }
    
    const { details } = certificateData;



    const handleDownloadPDF = async () => {
        try {
        setIsLoading(true);
          const res = await fetch('https://dev.certs365.io/api/pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ certificateData }),
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate_${details.certificateNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          } else {
            console.error('Failed to fetch PDF:', res.statusText);
          }
        } catch (error) {
          console.error('Error downloading PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container py-5'>
            <div className='text-center mb-5'>
                <Button 
                    label="Download Certificate"
                    onClick={handleDownloadPDF}
                    className='golden'
                />
            </div>
            <div className='certificate-template position-relative' id="template-3">
                <div className='hero-logo m-auto position-relative'>
                    <Image
                        src='https://images.netcomlearning.com/ai-certs/logo-black.svg'
                        layout='fill'
                        objectFit="contain"
                        alt='AI Certs logo'
                    />
                </div>
                <div className='hero-info text-center'>This is to certify that</div>
                <div className='issued-to text-center'>{details.name}</div>
                <div className='hero-message text-center'>Has successfully completed the requirements to be recognized as</div>
                <div className='course-name text-center'>{details.course}</div>
                <div className='issued-by text-center'>
                    <div className='signature position-relative'>
                        <Image
                            src='https://images.netcomlearning.com/ai-certs/russel-signature.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                    <hr />
                    <div className='issuer-info d-flex justify-content-between align-items-center'>
                        <div className='issuer-name'>Russell Sarder</div>
                        <div className='issuer-designation'>Chairman & CEO, AI Certs<sup>&trade;</sup></div>
                    </div>
                </div>
                <div className='badge-position position-absolute'>
                    <div className='ai-badge-logo'>
                        <Image
                            src='https://images.netcomlearning.com/ai-certs/bitcoin-certified-trainer-badge.svg'
                            layout='fill'
                            objectFit="contain"
                            alt='Russel Sarder'
                        />
                    </div>
                </div>
                <div className='bottom-info d-flex justify-content-center align-items-center w-100 position-absolute'>
                    <div className='certificate-info'>Certificate No.: {details.certificateNumber}</div> 
                    <span>|</span>
                    <div className='certificate-info'>Grant Date: {new Date(details.grantDate).toLocaleDateString('en-GB')}</div>
                    <span>|</span>
                    <div className='certificate-info'>Expiration Date: {new Date(details.expirationDate).toLocaleDateString('en-GB')}</div>
                </div>
                <div className='qr-details'>
                    <img src={certificateData.qrCodeImage} alt='QR info' />
                </div>
            </div>

            {/* Loading Modal for API call */}
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CertificateTemplateThree;
