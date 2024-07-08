import React, { useState } from 'react';
import PicModal from './picModal';

const Gallery = ({ images, selections, setSelections, userId, userPoints, setUserPoints }) => {
  const [modalShow, setModalShow] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentImageId, setCurrentImageId] = useState('');

  const handleSelection = (category, imageId) => {
    setSelections({ ...selections, [category]: imageId });
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

  return (
    <>
      <div className="flex overflow-x-auto snap-x snap-mandatory w-full h-full">
        {images.map((image, index) => (
          <div key={index} className="snap-center flex-shrink-0 w-full h-full flex flex-col items-center justify-center mx-4 bg-white rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-lg overflow-hidden" style={{ width: '100%', height: '70vh' }}>
              <img
                className="w-full h-full object-contain cursor-pointer"
                src={image.url}
                alt="Image"
                onClick={() => openModal(image.url, image._id)}
              />
            </div>
            <div className="flex justify-center space-x-3 mt-4 mb-6 bg-gray-200 p-4 rounded-b-lg shadow-md w-full">
              <button
                onClick={() => handleSelection('kiss', image._id)}
                className={`${selections.kiss === image._id ? "bg-red-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full transition duration-300`}
              >
                Kiss
              </button>
              <button
                onClick={() => handleSelection('marry', image._id)}
                className={`${selections.marry === image._id ? "bg-green-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full transition duration-300`}
              >
                Marry
              </button>
              <button
                onClick={() => handleSelection('fade', image._id)}
                className={`${selections.fade === image._id ? "bg-blue-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded-full transition duration-300`}
              >
                Fade
              </button>
            </div>
          </div>
        ))}
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

export default Gallery;