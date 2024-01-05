import React, { useState } from 'react';

const AddPerson = () => {
  const [person, setPerson] = useState({
    name: '',
    instagram: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState('');


   const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(''); // Reset submission status on new submit

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
        setSubmissionStatus('Person added successfully');
        // You can clear the form or redirect the user
        // Example: setPerson({ name: '', age: '', ... });
      } else {
        console.error('Failed to add person');
        setSubmissionStatus('Failed to add person');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus(`Error submitting form: ${error.message}`);
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Instagram</label>
        <input
          type="text"
          name="name"
          value={person.instagram}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>
    
     
     

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
      {submissionStatus && (
        <div className="mt-3 text-center">
          {submissionStatus}
        </div>
      )}
    </form>
  );
};

export default AddPerson;