import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import UserModal from './UserModal'; // Adjust the import path as necessary

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
    }
  }, []);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <header className="bg-black text-white py-1 shadow-md">
        <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <img src="/KMF.png" alt="KMF Logo" className="h-8" /> {/* Adjust image size as needed */}
          <p className="text-gray-400">{username ? `${username}` : 'Not Logged In'}</p>
          <button
  onClick={handleModalToggle}
  className="font-bold text-white py-1 px-3 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 bg-transparent border border-yellow-500 hover:bg-yellow-500 hover:text-black"
>
  $$
</button>


        </nav>
      </header>
      <UserModal show={showModal} onClose={handleModalToggle} />
    </>
  );
};

export default Navbar;
