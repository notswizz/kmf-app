import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PicModal from '../components/picModal';
import NavBar from '../components/navBar';
import { useRouter } from 'next/router';
import { useSound } from '../components/SoundContext'; 

const KMFPage = () => {

  const router = useRouter();
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kiss: null, marry: null, fade: null });
  const [modalShow, setModalShow] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [showPointsDisplay, setShowPointsDisplay] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [showImages, setShowImages] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [currentImageId, setCurrentImageId] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State to track mute status

 


  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setUserId(user._id.$oid);
      setUserPoints(user.points);
    }
    fetchImages();
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

    if (!isMuted) { // Use isMuted instead of soundIsMuted
      switch (category) {
        case 'kiss':
          new Audio('/kiss.wav').play();
          break;
        case 'marry':
          new Audio('/bells.wav').play();
          break;
        case 'fade':
          new Audio('/click.mp3').play();
          break;
        default:
          break;
      }
    }
  };

  const isSubmitVisible = () => {
    return selections.kiss && selections.marry && selections.fade;
  };

  const openModal = (imageUrl, imageId) => {
    setCurrentImageUrl(imageUrl);
    setCurrentImageId(imageId);
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
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    const uniqueSelections = new Set(Object.values(selections));
    if (uniqueSelections.size === 3) {
      try {
        const userCookie = Cookies.get('user');
        const user = userCookie ? JSON.parse(userCookie) : null;

        const submitResponse = await fetch('/api/kmfApi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user ? user._id : null,
            selections: selections
          }),
        });

        if (submitResponse.ok) {
          setShowImages(false);
          setShowSubmitButton(false);

          if (user) {
            const pointsResponse = await fetch('/api/addPoint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id })
            });

            if (pointsResponse.ok) {
              await updatePoints();
              setShowPointsDisplay(true);

              const userResponse = await fetch(`/api/getUser?username=${encodeURIComponent(user.username)}`);
              if (userResponse.ok) {
                const updatedUserData = await userResponse.json();
                Cookies.set('user', JSON.stringify(updatedUserData), { expires: 1 });

                setUserPoints(updatedUserData.points);
                setShowPointsDisplay(true);

                // Clear images before fetching new ones
                setImages([]);

                // Fetch new images while displaying the points screen
                await fetchImages();

                setTimeout(() => {
                  setShowPointsDisplay(false);
                  setShowImages(true);
                  setShowSubmitButton(true);
                  setIsLoading(false);
                }, 1000); // Adjust the duration as needed
              } else {
                console.error('Failed to fetch updated user data');
              }
            } else {
              console.error('Failed to update points');
            }
          } else {
            setShowPointsDisplay(true);
            setTimeout(async () => {
              setShowPointsDisplay(false);
              setShowImages(true);
              setShowSubmitButton(true);
              setIsLoading(false);
              // Clear images before fetching new ones
              setImages([]);
              // Fetch new images
              await fetchImages();
            }, 1000); // Adjust the duration as needed
          }

          setSelections({ kiss: null, marry: null, fade: null });
        } else {
          console.error('Submission failed');
        }

        if (!isMuted && typeof window !== 'undefined') {
          new Audio('/win.wav').play();
        }

      } catch (error) {
        console.error('Error during submission:', error);
      }
    } else {
      console.error('Please make a unique selection for     each category');
    }
  };

  return (
    <>
   <NavBar handleMuteToggle={() => setIsMuted(!isMuted)} isMuted={isMuted} />
      {showPointsDisplay && (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
          <div className="w-[375px] h-[667px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-8 bg-gray-700 rounded-lg shadow-xl w-full">
                <h2 className="text-4xl font-bold text-white mb-4">Points</h2>
                <p className="text-3xl font-semibold text-yellow-300 animate-pulse">{userPoints}</p>
                <img src="/zoomkmf.gif" alt="Animated Celebration" className="mt-4 w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      )}
  
      <div className="container mx-auto p-4 w-[375px]">
        {showImages && (
          <div className="grid grid-cols-1 gap-6">
            {images.map((image, index) => (
              <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800">
                <img
                  className="w-full h-72 object-contain cursor-pointer border-2 border-gray-700 rounded-lg shadow-lg p-1"
                  src={image.url}
                  alt="Image"
                  onClick={() => openModal(image.url, image._id)}
                />
                <div className="flex justify-center space-x-3 mt-4 mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
                  <button
                    onClick={() => handleSelection('kiss', image._id)}
                    className={`${selections.kiss === image._id ? "bg-red-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
                  >
                    Kiss
                  </button>
                  <button
                    onClick={() => handleSelection('marry', image._id)}
                    className={`${selections.marry === image._id ? "bg-green-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
                  >
                    Marry
                  </button>
                  <button
                    onClick={() => handleSelection('fade', image._id)}
                    className={`${selections.fade === image._id ? "bg-blue-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full text-base`}
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
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit'
              )}
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
