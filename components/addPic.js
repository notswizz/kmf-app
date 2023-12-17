import React, { useState, useEffect } from 'react';

const AddPic = () => {
  const [image, setImage] = useState(null);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [killCount, setKillCount] = useState(0);
  const [marryCount, setMarryCount] = useState(0);
  const [fuckCount, setFuckCount] = useState(0);

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

    if (image) {
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

        if (response.ok) {
          console.log("Image uploaded successfully");
          // Handle success
          setImage(null); // Clear the image state
        } else {
          console.error("Upload failed");
          // Handle error
        }
      } catch (error) {
        console.error("Error during upload: ", error);
        // Handle error
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
