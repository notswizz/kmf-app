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
      <div className="w-[450px] bg-[#1D1D1D]">
        <div className="container mx-auto p-4 bg-black rounded-lg shadow-lg">
          <div className="flex justify-between items-center my-4">
            {randomImages.length > 0 && (
              <img
                src={randomImages[0].url}
                alt="Random Image"
                className="w-1/3 h-48 object-cover"
              />
            )}
            <img src="/KMF.png" alt="KMF Logo" className="max-h-[150px]" />
            {randomImages.length > 1 && (
              <img
                src={randomImages[1].url}
                alt="Random Image"
                className="w-1/3 h-48 object-cover"
              />
            )}
          </div>

          {showLogin ? <Login /> : <Register />}

          <div className="flex justify-between items-center my-4">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
            >
              {showLogin ? 'Register' : 'Login'}
            </button>

            <Link href="/info" legacyBehavior>
              <a
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
                title="Info"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                ℹ {/* Emoji or icon for info */}
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
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
    </div>
  );
};

export default IndexPage;
