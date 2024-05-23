import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PicModal from '../components/picModal';
import NavBar from '../components/navBar';
import { useRouter } from 'next/router';





const KMFPage = () => {
  const router = useRouter(); // Initialize the router
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kiss: null, marry: null, fade: null });
  const [modalShow, setModalShow] = useState(false);
const [currentImageUrl, setCurrentImageUrl] = useState('');
const [currentGradient, setCurrentGradient] = useState(0);
const [showPointsDisplay, setShowPointsDisplay] = useState(false);
const [userPoints, setUserPoints] = useState(0);
const [showImages, setShowImages] = useState(true);
const [showSubmitButton, setShowSubmitButton] = useState(true);
const [currentImageId, setCurrentImageId] = useState('');
const [userId, setUserId] = useState(null);







useEffect(() => {
  const userCookie = Cookies.get('user');
  if (!userCookie) {
    router.push('/');
  } else {
    const user = JSON.parse(userCookie);
    setUserId(user._id.$oid); // Set the user ID to the string inside _id.$oid
    fetchImages();
  }
}, [router]);



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

  const updatePoints = async () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      const userResponse = await fetch(`/api/getUser?username=${encodeURIComponent(user.username)}`);
      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        setUserPoints(updatedUserData.points);
      }
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
    return selections.kiss && selections.marry && selections.fade;
  };

  const openModal = (imageUrl, imageId) => {
    setCurrentImageUrl(imageUrl);
    setCurrentImageId(imageId); // Set the current image ID
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

  const handleError = (message) => {
    console.error(message);
    router.push('/'); // Redirect to the index page when an error occurs
  };

  const handleSubmit = async () => {
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === 3) {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const user = JSON.parse(userCookie);
  
          // Submitting the selections
          const submitResponse = await fetch('/api/kmfApi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id, // Send user ID to the server
              selections: selections
            }),
          });
  
          if (submitResponse.ok) {
            // Hide images and submission button
            setShowImages(false);
            setShowSubmitButton(false);
  
            // Add a point to the user's score
            const pointsResponse = await fetch('/api/addPoint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id }) // Send user ID to the server
            });
  
            if (pointsResponse.ok) {
              // Update the points display and NavBar
              await updatePoints();
              setShowPointsDisplay(true);
              setImages([]); // Clear the current images
  
              // Fetch the updated user data
              const userResponse = await fetch(`/api/getUser?username=${encodeURIComponent(user.username)}`);
              if (userResponse.ok) {
                const updatedUserData = await userResponse.json();
                Cookies.set('user', JSON.stringify(updatedUserData), { expires: 1 });
  
                // Show the updated points display
                setUserPoints(updatedUserData.points);
                setShowPointsDisplay(true);
  
                // Set a timeout to hide the points display and show new images and button
                setTimeout(async () => {
                  setShowPointsDisplay(false);
                  await fetchImages(); // Fetch new images after the timeout
                  setShowImages(true);
                  setShowSubmitButton(true);
                }, 5000); // Adjust the duration as needed
              } else {
                console.error('Failed to fetch updated user data');
              }
            } else {
              console.error('Failed to update points');
            }
  
            setSelections({ kiss: null, marry: null, fade: null });
          } else {
            console.error('Submission failed');
          }
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
      <NavBar />
      {showPointsDisplay && (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
          <div className="w-[375px] h-[667px] bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 w-full">
                <h2 className="text-4xl font-bold text-white mb-4">Points</h2>
                <p className="text-3xl font-semibold text-yellow-300 animate-pulse">{userPoints}</p>
                <img src="/zoomkmf.gif" alt="Animated Celebration" className="mt-4 w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      )}
  
      <div className={`container mx-auto p-4 ${gradients[currentGradient]} w-[375px]`}>
        {showImages && (
          <div className="grid grid-cols-1 gap-6">
            {images.map((image, index) => (
              <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-gray-800">
                <img
                  className="w-full h-72 object-contain cursor-pointer border-2 border-gray-600 rounded-lg shadow-lg p-1"
                  src={image.url}
                  alt="Image"
                  onClick={() => openModal(image.url, image._id)}
                />
  
                <div className="flex justify-center space-x-3 mt-4 mb-6 bg-gray-900 p-4 rounded-lg shadow-md">
                  <button
                    onClick={() => handleSelection('kiss', image._id)}
                    className={`${selections.kiss === image._id ? "bg-red-600 hover:bg-red-800" : "bg-gray-500 hover:bg-gray-600"} text-white font-bold py-2 px-4 rounded-full text-base transition duration-300 ease-in-out`}
                  >
                    Kiss
                  </button>
                  <button
                    onClick={() => handleSelection('marry', image._id)}
                    className={`${selections.marry === image._id ? "bg-green-600 hover:bg-green-800" : "bg-gray-500 hover:bg-gray-600"} text-white font-bold py-2 px-4 rounded-full text-base transition duration-300 ease-in-out`}
                  >
                    Marry
                  </button>
                  <button
                    onClick={() => handleSelection('fade', image._id)}
                    className={`${selections.fade === image._id ? "bg-blue-600 hover:bg-blue-800" : "bg-gray-500 hover:bg-gray-600"} text-white font-bold py-2 px-4 rounded-full text-base transition duration-300 ease-in-out`}
                  >
                    Fade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {isSubmitVisible() && showSubmitButton && (
          <div className="text-center mt-8">
            <button onClick={handleSubmit} className="galaxy-button">
              Submit
            </button>
          </div>
        )}
      </div>
      
      <PicModal
        show={modalShow}
        onClose={closeModal}
        imageUrl={currentImageUrl}
        imageId={currentImageId}
        userId={userId}
        userPoints={userPoints}
        setUserPoints={setUserPoints}
      />
    </>
  );
  

  
};

export default KMFPage;