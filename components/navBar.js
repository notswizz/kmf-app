import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
    }
  }, []);

  return (
    <header className="bg-black text-white py-1 shadow-md">
      <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <img src="/KMF.png" alt="KMF Logo" className="h-8"/> {/* Adjust image size as needed */}
        <p className="text-gray-400">{username ? `${username}` : 'Not Logged In'}</p>
        <p className="font-bold">KMF</p> {/* Displaying "KMF" in bold */}
      </nav>
    </header>
  );
};

export default Navbar;
