import React from 'react';

const PicModal = ({ show, onClose, imageUrl }) => {
  if (!show) {
    return null;
  }

  const handleBuyOnInstagram = () => {
    // Implement your logic to handle the purchase or redirect to Instagram
    console.log('Redirecting to Instagram for purchase...');
    // For example, open a new window with the Instagram page
    // window.open('https://www.instagram.com/yourpage/', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged Pic" className="w-full object-contain" />
       
        <button 
  onClick={handleBuyOnInstagram}
  className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded transition ease-in duration-200 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
>
  <div className="flex flex-col items-center">
    <span>Buy Instagram</span>
    <span className="text-sm text-blue-100 mt-1">10,000 points</span>
  </div>
</button>


<button 
  className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold rounded transition ease-in duration-200 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-purple-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
>
  <div className="flex flex-col items-center">
    <span>Buy Album</span>
    <span className="text-sm text-purple-100 mt-1">5,000 points</span>
  </div>
</button>



      </div>
    </div>
  );
};

export default PicModal;
