import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import UserModal from './UserModal'; // Adjust the import path as necessary
import Login from './loginForm';
import Register from './registerForm';
import { useSound } from '../components/SoundContext'; // Import useSound hook

const Navbar = () => {
  const { isMuted, toggleMute } = useSound(); // Get isMuted and toggleMute from SoundContext
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

  const handleLoginToggle = () => {
    setShowLogin(!showLogin);
    setShowRegister(false); // Ensure register form is hidden
  };

  const handleRegisterToggle = () => {
    setShowRegister(!showRegister);
    setShowLogin(false); // Ensure login form is hidden
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
    }
  };

  const handleLogout = () => {
    Cookies.remove('user');
    setUsername('');
  };

  return (
    <>
      <header className="bg-black text-white py-1 shadow-md">
        <nav className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <img src="/KMF.png" alt="KMF Logo" className="h-8" /> {/* Adjust image size as needed */}
          <p className="text-gray-400">{username ? `${username}` : 'Not Logged In'}</p>
          <div className="flex space-x-4">
            {!username ? (
              <>
                <button
                  onClick={handleLoginToggle}
                  className="font-bold text-white py-1 px-3 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 bg-transparent border border-yellow-500 hover:bg-yellow-500 hover:text-black"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterToggle}
                  className="font-bold text-white py-1 px-3 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 bg-transparent border border-yellow-500 hover:bg-yellow-500 hover:text-black"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="font-bold text-white py-1 px-3 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 bg-transparent border border-red-500 hover:bg-red-500 hover:text-black"
              >
                Logout
              </button>
            )}
            <button
              onClick={toggleMute} // Toggle mute functionality
              className="font-bold text-white py-1 px-3 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 bg-transparent border border-purple-500 hover:bg-purple-500 hover:text-black"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </nav>
      </header>
      <UserModal show={showModal} onClose={handleModalToggle} />
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Login onLoginSuccess={handleLoginSuccess} />
            <button
              onClick={handleLoginToggle}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Register onRegisterSuccess={handleLoginSuccess} />
            <button
              onClick={handleRegisterToggle}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;