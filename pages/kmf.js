import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import NavBar from '../components/navBar';
import Gallery from '../components/Gallery';
import Submit from '../components/Submit';
import { useRouter } from 'next/router';

const KMFPage = () => {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [selections, setSelections] = useState({ kiss: null, marry: null, fade: null });
  const [showPointsDisplay, setShowPointsDisplay] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [showImages, setShowImages] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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



  const isSubmitVisible = () => {
    return selections.kiss && selections.marry && selections.fade;
  };

  return (
    <>
      <NavBar handleMuteToggle={() => setIsMuted(!isMuted)} isMuted={isMuted} />
      {showPointsDisplay && (
        <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-b from-gray-900 to-black bg-opacity-75 z-50">
          <div className="w-[375px] h-[667px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-8 bg-gray-700 rounded-lg shadow-xl w-full">
                <h2 className="text-4xl font-bold text-white mb-4">Points</h2>
                <p className="text-3xl font-semibold text-yellow-300 animate-pulse">{userPoints}</p>
                <img src="/zoomkmf.gif" alt="Animated Celebration" className="mt-4 w-3/4 mx-auto rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-8">
        {showImages && (
          <div className="w-full max-w-4xl">
            <Gallery
              images={images}
              selections={selections}
              setSelections={setSelections}
              userId={userId}
              userPoints={userPoints}
              setUserPoints={setUserPoints}
            />
          </div>
        )}
        {isSubmitVisible() && showSubmitButton && (
          <div className="w-full max-w-md">
            <Submit
              selections={selections}
              setSelections={setSelections}
              setShowImages={setShowImages}
              setShowSubmitButton={setShowSubmitButton}
              setIsLoading={setIsLoading}
              setShowPointsDisplay={setShowPointsDisplay}
              setUserPoints={setUserPoints}
              fetchImages={fetchImages}
              updatePoints={updatePoints}
              isLoading={isLoading}
              setImages={setImages}
            />
          </div>
        )}
      </div>
    </>
  );
  
};

export default KMFPage;