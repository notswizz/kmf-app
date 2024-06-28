import React, { useState, useEffect } from 'react';

const PersonDisplay = () => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [images, setImages] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/getPerson');
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        } else {
          throw new Error('Failed to fetch people');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const handleSelectPerson = async (event) => {
    const personId = event.target.value;
    setSelectedPerson(personId);

    if (personId) {
      try {
        const response = await fetch(`/api/displayPerson?personId=${personId}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          throw new Error('Failed to fetch images');
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    } else {
      setImages([]);
      setAverageScore(null);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`/api/deleteImage?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image._id !== imageId));
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchAverageScore = async () => {
      if (selectedPerson) {
        try {
          const response = await fetch(`/api/averageScores?personId=${selectedPerson}`);
          if (response.ok) {
            const data = await response.json();
            setAverageScore(data.averageScore);
          } else {
            throw new Error('Failed to fetch average score');
          }
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
      }
    };

    fetchAverageScore();
  }, [selectedPerson]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Select a Person</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center mb-4">
        <label className="text-lg font-medium mr-2">Select a person:</label>
        <select
          value={selectedPerson}
          onChange={handleSelectPerson}
          className="form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
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
              <li key={image._id} className="border rounded-lg overflow-hidden shadow">
                <img
                  src={image.url}
                  alt={`Image for ${selectedPerson}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-100 text-center">
                  <p className="text-lg font-semibold">Score: {image.score}</p>
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="mt-2 inline-block bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonDisplay;
