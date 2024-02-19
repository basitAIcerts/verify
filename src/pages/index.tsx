import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Navigation from '@/app/navigation';
import VerifyDocumets from "./verify-documents"
const LoginPage = () => {
    return (
        <div className='container-fluid'>  
            <Navigation />
            <div className="container">
                <VerifyDocumets />
            </div>
        </div>
    );
}

export default LoginPage;
