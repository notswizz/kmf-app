import React, { useState } from 'react';

const PicModal = ({ show, onClose, imageUrl, imageId, userPoints, setUserPoints }) => {
  const [purchaseStatus, setPurchaseStatus] = useState('');

  if (!show) {
    return null;
  }

  const handlePurchase = async (pointsCost, platform) => {
    if (userPoints < pointsCost) {
      setPurchaseStatus('Insufficient points');
      return;
    }

    const response = await fetch('/api/purchaseInstagram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, pointsToDeduct: pointsCost, imageId }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserPoints(data.newPoints);
      setPurchaseStatus(`Purchase successful on ${platform}`);
      if (platform === 'Instagram') {
        window.open(`https://www.instagram.com/${data.instagramHandle}/`, '_blank');
      }
    } else {
      setPurchaseStatus('Purchase failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative bg-gray-900 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={imageUrl} alt="Enlarged Pic" className="w-full object-contain border-2 border-gray-300 rounded-md mb-4" />
        {purchaseStatus && <p className="text-center mb-4 font-semibold text-green-500">{purchaseStatus}</p>}
        <button
          onClick={() => handlePurchase(10000, 'Instagram')}
          className="w-full mt-2 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg transition ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 shadow-lg text-sm"
        >
          <div className="flex flex-col items-center">
            <span>Buy Instagram</span>
            <span className="text-xs text-blue-100 mt-1">10,000 points</span>
          </div>
        </button>
        <button
          onClick={() => handlePurchase(5000, 'Album')}
          className="w-full mt-2 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold rounded-lg transition ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 hover:scale-105 shadow-lg text-sm"
        >
          <div className="flex flex-col items-center">
            <span>Buy Album</span>
            <span className="text-xs text-purple-100 mt-1">5,000 points</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PicModal;
