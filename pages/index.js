// pages/index.js
import React, { useEffect, useState } from 'react';

const IndexPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/download');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      } else {
        console.error('Failed to fetch images');
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src={image.url} alt={image.filename} />
            <div className="px-6 py-4">
              <p className="text-gray-700 text-base">{image.filename}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
