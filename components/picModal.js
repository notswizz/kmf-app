// components/PicModal.js
import React from 'react';

const PicModal = ({ show, onClose, imageUrl }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
        <img src={imageUrl} alt="Enlarged Pic" className="w-full object-contain" />
      </div>
    </div>
  );
};

export default PicModal;
