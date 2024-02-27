import { logout } from '@/common/auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


const Navigation = () => {
 
  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className='nav-logo'>
            <Link className="navbar-brand" href="/">
              <Image
                src='https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
                layout='fill'
                objectFit="contain"
                alt='AI Certs logo'
              />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;