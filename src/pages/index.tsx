import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navigation from '@/app/navigation';
import ScanDocuments from "@/pages/scan-qr"
const LoginPage = () => {
    return (
        <>  
            <Navigation />
            <div className="container">
                <ScanDocuments />
            </div>
        </>
    );
}

export default LoginPage;
