import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Login from '../components/loginForm'; // Adjust the path as necessary
import Register from '../components/registerForm'; // Adjust the path as necessary


const IndexPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [randomImages, setRandomImages] = useState([]);
  const [moreRandomImages, setMoreRandomImages] = useState([]); // Additional state for the second group of images

  useEffect(() => {
    const fetchRandomImages = async () => {
      const response = await fetch('/api/download');
      if (response.ok) {
        const data = await response.json();
        const shuffledImages = shuffleArray(data.images);
        const selectedImages = shuffledImages.slice(0, 3);
        const moreSelectedImages = shuffledImages.slice(3, 6);
        setRandomImages(selectedImages);
        setMoreRandomImages(moreSelectedImages);
      }
    };

    fetchRandomImages();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const renderImages = (images) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image._id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <img
            src={image.url}
            alt="Random Image"
            className="w-full h-48 object-cover"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center" style={{ backgroundColor: '#1D1D1D' }}>
      <div className="container mx-auto p-4" style={{ backgroundColor: 'black', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div className="grid grid-cols-3 gap-4">
            {randomImages.map((image) => (
              <div key={image._id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src={image.url}
                  alt="Random Image"
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
      <img src="/KMF.png" alt="KMF Logo" className="mx-auto" style={{ maxHeight: '150px' }} />
     
        <div className="mt-8">
         
          

        </div>
  

  
        {showLogin ? <Login /> : <Register />}

      
        <button
          onClick={() => setShowLogin(!showLogin)}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded my-4 transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
        >
          {showLogin ? 'Register' : 'Login'}
        </button>

        
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-4">
            {moreRandomImages.map((image) => (
              <div key={image._id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src={image.url}
                  alt="Random Image"
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
          
        </div>

    
      </div>

          <Link href="/info" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline">
              Info
            </a>
          </Link>
    </div>
  );
};

export default IndexPage;
