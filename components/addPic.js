import React, { useState } from 'react';

const AddPic = () => {
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log("Image uploaded successfully");
          // Handle success
        } else {
          console.error("Upload failed");
          // Handle error
        }
      } catch (error) {
        console.error("Error during upload: ", error);
        // Handle error
      }

      setImage(null); // Clear the image state
    } else {
      console.error("No image selected");
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} className="block w-full text-sm text-gray-500"/>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Upload Image
      </button>
    </form>
  );
}

export default AddPic;
