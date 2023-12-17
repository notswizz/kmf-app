import React, { useEffect, useState } from 'react';

const IndexPage = () => {
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kill: null, marry: null, fuck: null });

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/download');
      if (response.ok) {
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images.sort(() => 0.5 - Math.random()).slice(0, 3));
        } else {
          console.error('Data does not have an images array:', data);
        }
      } else {
        console.error('Failed to fetch images');
      }
    };
    fetchImages();
  }, []);

  const handleSelection = (category, imageId) => {
    setSelections({ ...selections, [category]: imageId });
  };

  const isSubmitVisible = () => {
    return selections.kill && selections.marry && selections.fuck;
  };

  const handleSubmit = async () => {
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === images.length) {
      try {
        const response = await fetch('/api/kmf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selections),
        });
  
        if (response.ok) {
          console.log('Submitted successfully');
  
          // Reset selections
          setSelections({ kill: null, marry: null, fuck: null });
  
          // Re-fetch images
          fetchImages(); // Assuming fetchImages is the function you used to initially fetch the images
  
        } else {
          console.error('Submission failed');
        }
      } catch (error) {
        console.error('Error during submission:', error);
      }
    } else {
      console.error('Please make a unique selection for each category');
    }
  };
  
  const fetchImages = async () => {
    const response = await fetch('/api/download');
    if (response.ok) {
      const data = await response.json();
      if (data.images && Array.isArray(data.images)) {
        // Ensure unique persons
        const uniqueImages = new Set();
        const selectedImages = [];
        for (const image of data.images.sort(() => 0.5 - Math.random())) {
          if (!uniqueImages.has(image.personId) && uniqueImages.size < 3) {
            uniqueImages.add(image.personId);
            selectedImages.push(image);
          }
        }
        setImages(selectedImages);
      } else {
        console.error('Data does not have an images array:', data);
      }
    } else {
      console.error('Failed to fetch images');
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Images</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <img className="w-full" src={image.url} alt={image.filename} />
            <div className="px-6 py-4">
              <p className="text-gray-700 text-base mb-4">{image.filename}</p>
  <button 
    onClick={() => handleSelection('kill', image._id)}
    className={`${
      selections.kill === image._id
        ? "bg-red-500 text-white"
        : "bg-gray-300 text-gray-700"
    } mr-2 mb-2 px-4 py-2 rounded`}
  >
    Kill
  </button>
  <button 
    onClick={() => handleSelection('marry', image._id)}
    className={`${
      selections.marry === image._id
        ? "bg-green-500 text-white"
        : "bg-gray-300 text-gray-700"
    } mr-2 mb-2 px-4 py-2 rounded`}
  >
    Marry
  </button>
  <button 
    onClick={() => handleSelection('fuck', image._id)}
    className={`${
      selections.fuck === image._id
        ? "bg-blue-500 text-white"
        : "bg-gray-300 text-gray-700"
    } mr-2 mb-2 px-4 py-2 rounded`}
  >
    Fuck
  </button>
</div>

          </div>
        ))}
      </div>
      {isSubmitVisible() && (
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      )}
    </div>
  );
};

export default IndexPage;
