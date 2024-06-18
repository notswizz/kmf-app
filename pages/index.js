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
        const selectedImages = shuffledImages.slice(0, 2); // Get first two images
        const moreSelectedImages = shuffledImages.slice(2, 5); // Get next three images
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1D1D1D]">
      <div className="w-full max-w-sm bg-black p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          {randomImages.length > 0 && (
            <div className="w-1/3 h-48 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
              <img
                src={randomImages[0].url}
                alt="Random Image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="text-center mx-4">
            <img src="/KMF.png" alt="KMF Logo" className="max-h-[100px] mx-auto" />
            <p className="text-xl font-bold text-white mt-2">
              <span className="block">Kiss</span>
              <span className="block">Marry</span>
              <span className="block">Fade</span>
            </p>
          </div>
          {randomImages.length > 1 && (
            <div className="w-1/3 h-48 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
              <img
                src={randomImages[1].url}
                alt="Random Image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {showLogin ? <Login /> : <Register />}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="w-full bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
          >
            {showLogin ? 'Register' : 'Login'}
          </button>
          <Link href="/info" legacyBehavior>
            <a
              className="ml-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
              title="Info"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              ℹ {/* Emoji or icon for info */}
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {moreRandomImages.map((image) => (
            <div key={image._id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
              <img
                src={image.url}
                alt="Random Image"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
