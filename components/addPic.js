import React, { useState, useEffect } from 'react';

const AddPic = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    const filePreviews = files.map((file) => {
      return { file, preview: URL.createObjectURL(file) };
    });
    setImagePreviews(filePreviews);

    const progressArray = files.map(() => 0);
    setLoadingProgress(progressArray);

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded * 100) / e.total);
          setLoadingProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = progress;
            return newProgress;
          });
        }
      };
      reader.onloadend = () => {
        setLoadingProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = 100;
          return newProgress;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus('');
    setIsLoading(true);

    if (images.length > 0) {
      let uploadSuccessful = true;

      for (const image of images) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('person', selectedPerson);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            console.error("Upload failed for an image");
            uploadSuccessful = false;
            break;
          }
        } catch (error) {
          console.error("Error during upload: ", error);
          uploadSuccessful = false;
          break;
        }
      }

      setIsLoading(false);

      if (uploadSuccessful) {
        console.log("All images uploaded successfully");
        setSubmissionStatus("All images uploaded successfully");
        setImages([]);
        setImagePreviews([]);
        setSelectedPerson('');
      } else {
        setSubmissionStatus("Failed to upload some or all images");
      }
    } else {
      console.error("No image selected");
      setSubmissionStatus("No image selected");
      setIsLoading(false);
    }
  };

  const handlePersonChange = (event) => {
    setSelectedPerson(event.target.value);
  };

  return (
    <form className="p-5 max-w-lg mx-auto bg-white rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
      <div className="text-lg font-semibold text-center text-gray-800">
        Upload an Image
      </div>
      <select
        onChange={handlePersonChange}
        value={selectedPerson}
        className="form-select block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      >
        <option value="">Select a person</option>
        {people.map((person, index) => (
          <option key={index} value={person._id}>{person.name}</option>
        ))}
      </select>
      <input
        type="file"
        onChange={handleImageChange}
        multiple
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      />
      <div className="mt-4">
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.preview} alt={`preview-${index}`} className="w-full h-32 object-cover rounded" />
                {loadingProgress[index] < 100 && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 text-white">
                    {loadingProgress[index]}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loadingProgress.some(progress => progress < 100)}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Uploading...
          </div>
        ) : (
          'Upload Image(s)'
        )}
      </button>
      {submissionStatus && (
        <div className={`mt-3 text-center text-sm font-medium ${submissionStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {submissionStatus}
        </div>
      )}
    </form>
  );
};

export default AddPic;
