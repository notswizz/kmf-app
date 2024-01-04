import React, { useState, useEffect } from 'react';

const PersonDisplay = () => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [images, setImages] = useState([]);
  const [averageScore, setAverageScore] = useState(null); // State for average score

  useEffect(() => {
    const fetchPeople = async () => {
      const response = await fetch('/api/getPerson');
      if (response.ok) {
        const data = await response.json();
        setPeople(data);
      }
    };

    fetchPeople();
  }, []);

  const handleSelectPerson = async (event) => {
    const personId = event.target.value;
    setSelectedPerson(personId);

    if (personId) {
      const response = await fetch(`/api/displayPerson?personId=${personId}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } else {
      // Clear images and average score if no person is selected
      setImages([]);
      setAverageScore(null);
    }
  };

  const handleDeleteImage = async (imageId) => {
    // Send a DELETE request to your API endpoint to delete the image
    const response = await fetch(`/api/deleteImage?imageId=${imageId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // If deletion is successful, remove the image from the state
      setImages((prevImages) => prevImages.filter((image) => image._id !== imageId));
    } else {
      // Handle error if the deletion fails
      console.error('Failed to delete image');
    }
  };

  // Fetch and update the average score when a person is selected
  useEffect(() => {
    const fetchAverageScore = async () => {
      if (selectedPerson) {
        const response = await fetch(`/api/averageScores?personId=${selectedPerson}`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns a single object with an averageScore property
          setAverageScore(data[0].averageScore);
        }
      }
    };

    fetchAverageScore();
  }, [selectedPerson]); // Only run when selectedPerson changes

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Select a Person</h2>
      <div className="flex items-center mb-4">
        <label className="text-lg font-medium mr-2">Select a person:</label>
        <select
          value={selectedPerson}
          onChange={handleSelectPerson}
          className="border rounded-md p-2"
        >
          <option value="">Select a person</option>
          {people.map((person) => (
            <option key={person._id} value={person._id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>

      {averageScore !== null && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Average Score for Selected Person:
          </h3>
          <p className="text-xl">{averageScore}</p>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Images for Selected Person:
          </h3>
          <ul className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <li key={image._id} className="border rounded-md overflow-hidden">
                <img
                  src={image.url}
                  alt={`Image for ${selectedPerson}`}
                  className="w-full h-auto"
                />
                <p className="text-center py-2 bg-gray-100">
                  Score: {image.score}
                </p>
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded mt-2 hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonDisplay;
