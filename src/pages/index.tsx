import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navigation from '@/app/navigation';
import VerifyDocumets from "./verify-documents"
const LoginPage = () => {
    return (
        <>  
            <Navigation />
            <div className="container">
                <VerifyDocumets />
            </div>
        </>
    );
}

export default LoginPage;
