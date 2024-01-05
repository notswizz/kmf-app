import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PicModal from '../components/picModal';
import NavBar from '../components/navBar';

async function fetchAverageScores() {
  const response = await fetch('/api/averageScores');
  if (response.ok) {
    const averages = await response.json();
    // Process and display averages
  } else {
    console.error('Failed to fetch average scores');
  }
}


const KMFPage = () => {
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kill: null, marry: null, fuck: null });
  const [modalShow, setModalShow] = useState(false);
const [currentImageUrl, setCurrentImageUrl] = useState('');
const [currentGradient, setCurrentGradient] = useState(0);



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
  
  const gradients = [
    'bg-gradient-to-r from-blue-500 to-green-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-orange-500 to-yellow-500',
    // Add more gradients as needed
  ];

  
  const handleSubmit = async () => {
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === 3) {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const user = JSON.parse(userCookie);
  
          // Submitting the selections
          const submitResponse = await fetch('/api/kmfApi', { // Adjust the endpoint as needed
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id, // Send user ID to the server
              selections: selections
            }),
          });
  
          if (submitResponse.ok) {
            const responseData = await submitResponse.json();
            console.log('Submitted successfully');
  
            // Log the new scores for each image
            if (responseData.newScores) {
              for (const [imageId, newScore] of Object.entries(responseData.newScores)) {
                console.log(`New score for image ${imageId}: ${newScore}`);
              }
            }
  
            setSelections({ kill: null, marry: null, fuck: null });
            fetchImages();
  
            // Add a point to the user's score
            const pointsResponse = await fetch('/api/addPoint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id }) // Send user ID to the server
            });
  
            if (pointsResponse.ok) {
              console.log('Points updated successfully');
            } else {
              console.error('Failed to update points');
            }
          } else {
            console.error('Submission failed');
          }
  
          // Update the gradient for UI effect
          setCurrentGradient((currentGradient + 1) % gradients.length);
  
        } else {
          console.error('User information not found in cookie');
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
  <NavBar/>
  <div className={`container mx-auto p-4 ${gradients[currentGradient]}`}>
    <h1 className="text-4xl font-bold text-center mb-8 text-white">KMF</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white">
          <img
            className="w-full object-cover h-72 sm:h-60 cursor-pointer" // Increased height on smaller screens
            src={image.url}
            alt="Image"
            onClick={() => openModal(image.url)}
          />
          <div className="flex justify-center space-x-3 mt-4 mb-6">
            <button
              onClick={() => handleSelection('kill', image._id)}
              className={`${selections.kill === image._id ? "bg-red-600 hover:bg-red-800" : "bg-gray-400 hover:bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
            >
              Kill
            </button>
            <button
              onClick={() => handleSelection('marry', image._id)}
              className={`${selections.marry === image._id ? "bg-green-600 hover:bg-green-800" : "bg-gray-400 hover:bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
            >
              Marry
            </button>
            <button
              onClick={() => handleSelection('fuck', image._id)}
              className={`${selections.fuck === image._id ? "bg-blue-600 hover:bg-blue-800" : "bg-gray-400 hover:bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
            >
              Fuck
            </button>
          </div>
        </div>
      ))}
    </div>
    {isSubmitVisible() && (
      <div className="text-center mt-8">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full">
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