import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/kmf');
  }, [router]);

  return null; // No need to render anything as we are redirecting
};

export default IndexPage;