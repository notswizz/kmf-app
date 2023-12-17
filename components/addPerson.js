import React, { useState } from 'react';

const AddPerson = () => {
  const [person, setPerson] = useState({
    name: '',
    age: '',
    boobs: 0, // Assuming this is a numeric value
    booty: 0, // Assuming this is a numeric value
    hairColor: ''
  });

  const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to the server
    try {
      const response = await fetch('/api/addPerson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });

      if (response.ok) {
        console.log('Person added successfully');
        // You can clear the form or redirect the user
      } else {
        console.error('Failed to add person');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={person.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
        <input
          type="number"
          name="age"
          value={person.age}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Boobs (0-4)</label>
        <input
          type="number"
          name="boobs"
          value={person.boobs}
          onChange={handleChange}
          min="0"
          max="4"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Booty (0-4)</label>
        <input
          type="number"
          name="booty"
          value={person.booty}
          onChange={handleChange}
          min="0"
          max="4"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Hair Color</label>
        <input
          type="text"
          name="hairColor"
          value={person.hairColor}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
};

export default AddPerson;