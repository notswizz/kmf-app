import React, { useState, useEffect } from 'react';

const AddPic = () => {
  const [image, setImage] = useState(null);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [killCount, setKillCount] = useState(0);
  const [marryCount, setMarryCount] = useState(0);
  const [fuckCount, setFuckCount] = useState(0);
  const [score, setScore] = useState(0); // Initialize score to 0

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

  const calculateScore = () => {
    return marryCount * 3 + fuckCount * 1 - killCount * 5;
  };

  useEffect(() => {
    // Update score whenever killCount, marryCount, or fuckCount changes
    const newScore = marryCount * 3 + fuckCount * 1 - killCount * 5;
    setScore(newScore);
  }, [killCount, marryCount, fuckCount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('person', selectedPerson);
      formData.append('kill', killCount);
      formData.append('marry', marryCount);
      formData.append('fuck', fuckCount);
      formData.append('score', score); // Append score to the form data

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

       // Inside your handleSubmit function after the fetch call
if (response.ok) {
  console.log("Image uploaded successfully");
  // Refresh the page to show new images or update state
  window.location.reload(); // This refreshes the page
} else {
  console.error("Upload failed");
}

      } catch (error) {
        console.error("Error during upload: ", error);
      }
    } else {
      console.error("No image selected");
    }
  };


  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
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
      <input type="file" onChange={handleImageChange} className="block w-full text-sm text-gray-500"/>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Upload Image
      </button>
    </form>
  );
};

export default AddPic;
