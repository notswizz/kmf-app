import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/navBar'; 
import PicModal from '../components/picModal';


const KMFPage = () => {
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kill: null, marry: null, fuck: null });
  const [modalShow, setModalShow] = useState(false);
const [currentImageUrl, setCurrentImageUrl] = useState('');


  useEffect(() => {
    fetchImages();
  }, []);

  const fetchNames = async (personIds) => {
    try {
      const response = await fetch('/api/getName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: personIds })
      });
      if (response.ok) {
        const names = await response.json();
        return names;
      } else {
        console.error('Failed to fetch names');
        return {};
      }
    } catch (error) {
      console.error('Error fetching names:', error);
      return {};
    }
  };

  const fetchImages = async () => {
    const response = await fetch('/api/download');
    if (response.ok) {
      const data = await response.json();
      if (data.images && Array.isArray(data.images)) {
        const uniqueImages = new Set();
        const selectedImages = [];
        const personIds = [];
        for (const image of data.images.sort(() => 0.5 - Math.random())) {
          if (!uniqueImages.has(image.personId) && uniqueImages.size < 3) {
            uniqueImages.add(image.personId);
            selectedImages.push(image);
            personIds.push(image.personId);
          }
        }

        const names = await fetchNames(personIds);
        const updatedImages = selectedImages.map(image => ({
          ...image,
          personName: names[image.personId] || 'Unknown'
        }));
        setImages(updatedImages);
      } else {
        console.error('Data does not have an images array:', data);
      }
    } else {
      console.error('Failed to fetch images');
    }
  };

  const handleSelection = (category, imageId) => {
    setSelections({ ...selections, [category]: imageId });
  };

  const isSubmitVisible = () => {
    return selections.kill && selections.marry && selections.fuck;
  };

  const openModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setModalShow(true);
  };
  
  const closeModal = () => {
    setModalShow(false);
    setCurrentImageUrl('');
  };
  

  const handleSubmit = async () => {
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === 3) {
      try {
        const submitResponse = await fetch('/api/kmf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selections),
        });
  
        if (submitResponse.ok) {
          console.log('Submitted successfully');
          setSelections({ kill: null, marry: null, fuck: null });
          fetchImages();
  
          // Retrieve user info from cookie
          const userCookie = Cookies.get('user');
          if (userCookie) {
            const user = JSON.parse(userCookie);
  
            // Add a point to the user's score
            const pointsResponse = await fetch('/api/addPoint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id }) // Send user ID to the server
            });
  
            if (!pointsResponse.ok) {
              console.error('Failed to update points');
            }
          } else {
            console.error('User information not found in cookie');
          }
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-8">Images</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <img 
                className="w-full object-cover h-60 cursor-pointer" 
                src={image.url} 
                alt="Image" 
                onClick={() => openModal(image.url)} 
              />
              <div className="flex justify-center space-x-3 mt-4 mb-6">
                <button 
                  onClick={() => handleSelection('kill', image._id)}
                  className={`${selections.kill === image._id ? "bg-red-500 hover:bg-red-700" : "bg-gray-300 hover:bg-gray-400"} text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-base`}
                >
                  Kill
                </button>
                <button 
                  onClick={() => handleSelection('marry', image._id)}
                  className={`${selections.marry === image._id ? "bg-green-500 hover:bg-green-700" : "bg-gray-300 hover:bg-gray-400"} text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-base`}
                >
                  Marry
                </button>
                <button 
                  onClick={() => handleSelection('fuck', image._id)}
                  className={`${selections.fuck === image._id ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"} text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-base`}
                >
                  Fuck
                </button>
              </div>
            </div>
          ))}
        </div>
        {isSubmitVisible() && (
          <div className="text-center mt-8">
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full">
              Submit
            </button>
          </div>
        )}
      </div>
      <PicModal
        show={modalShow}
        onClose={closeModal}
        imageUrl={currentImageUrl}
      />
    </>
  );
};

export default KMFPage;