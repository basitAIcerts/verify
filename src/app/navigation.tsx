import { logout } from '@/common/auth';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();
  const handleLogoClick = () => {
    router.push('/');
  };
 
  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid"> 
          <div onClick={handleLogoClick} className='nav-logo'>
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