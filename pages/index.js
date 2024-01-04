import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Login from '../components/loginForm'; // Adjust the path as necessary
import Register from '../components/registerForm'; // Adjust the path as necessary

const IndexPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    const fetchRandomImages = async () => {
      const response = await fetch('/api/download');
      if (response.ok) {
        const data = await response.json();
        // Shuffle the images to get a random selection
        const shuffledImages = shuffleArray(data.images);
        // Get the first three images (or fewer if there are less than three)
        const selectedImages = shuffledImages.slice(0, 3);
        setRandomImages(selectedImages);
      }
    };

    fetchRandomImages();
  }, []);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">KMF</h1>
        <div className="text-lg space-y-4">
          <p className="text-center">
            Explore choices in a playful way with the KMF Game. You'll get sets of three options.
            Decide who you'd Kill, Marry, or ... - it's all about preferences, and there are no wrong answers.
          </p>
        </div>

        <button
          onClick={() => setShowLogin(!showLogin)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 transition duration-300 ease-in-out"
        >
          {showLogin ? 'Register' : 'Login'}
        </button>

        {showLogin ? <Login /> : <Register />}

        <div className="mt-8">
    
          <div className="grid grid-cols-3 gap-4">
            {randomImages.map((image) => (
              <div key={image._id} className="border rounded-md overflow-hidden">
                <img
                  src={image.url}
                  alt={`Random Image`}
                  className="w-full h-auto"
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
