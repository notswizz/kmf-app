import React, { useState, useEffect } from 'react';

const AddPic = () => {
  const [images, setImages] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [killCount, setKillCount] = useState(0);
  const [marryCount, setMarryCount] = useState(0);
  const [fuckCount, setFuckCount] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/getPerson');
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        } else {
          console.error("Failed to fetch people");
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus(''); // Reset submission status on new submit

    if (images.length > 0) {
      let uploadSuccessful = true;

      for (const image of images) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('person', selectedPerson);
        formData.append('kill', killCount);
        formData.append('marry', marryCount);
        formData.append('fuck', fuckCount);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            console.error("Upload failed for an image");
            uploadSuccessful = false;
            break; // Stop the loop if any upload fails
          }
        } catch (error) {
          console.error("Error during upload: ", error);
          uploadSuccessful = false;
          break; // Stop the loop on error
        }
      }

      if (uploadSuccessful) {
        console.log("All images uploaded successfully");
        setSubmissionStatus("All images uploaded successfully");
        // Clear the images and counts after successful upload
        setImages([]);
        setKillCount(0);
        setMarryCount(0);
        setFuckCount(0);
      } else {
        setSubmissionStatus("Failed to upload some or all images");
      }
    } else {
      console.error("No image selected");
      setSubmissionStatus("No image selected");
    }
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  const handlePersonChange = (event) => {
    setSelectedPerson(event.target.value);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <select
        onChange={handlePersonChange}
        value={selectedPerson}
        className="block w-full text-sm text-gray-500 mb-4"
      >
        <option value="">Select a person</option>
        {people.map((person, index) => (
          <option key={index} value={person._id}>
            {person.name}
          </option>
        ))}
      </select>
      <input 
        type="file" 
        onChange={handleImageChange} 
        multiple 
        className="block w-full text-sm text-gray-500"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Upload Image(s)
      </button>
      {submissionStatus && (
        <div className="mt-3 text-center">
          {submissionStatus}
        </div>
      )}
    </form>
  );
};

export default AddPic;