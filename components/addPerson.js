import React, { useState } from 'react';

const AddPerson = () => {
  const [person, setPerson] = useState({
    name: '',
    instagram: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setPerson({ ...person, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('');

    if (!person.name || !person.instagram) {
      setSubmissionStatus('All fields are required');
      return;
    }

    setIsSubmitting(true);

    // Send a POST request to the server
    try {
      const response = await fetch('/api/addPerson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });

      setIsSubmitting(false);

      if (response.ok) {
        console.log('Person added successfully');
        setSubmissionStatus('Person added successfully');
        setPerson({ name: '', instagram: '' });
      } else {
        console.error('Failed to add person');
        setSubmissionStatus('Failed to add person');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus(`Error submitting form: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Add Person</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={person.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={person.instagram}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {submissionStatus && (
          <div className={`mt-3 text-center text-sm ${submissionStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {submissionStatus}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddPerson;
