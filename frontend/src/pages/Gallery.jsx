import { useState, useEffect } from 'react';

export default function Gallery() {
  const [file, setFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const [error, setError] = useState(''); // For displaying error messages

  // Placeholder images for the gallery
  const placeholderImages = [
    { id: 1, src: '/image2.jpg' }, 
    { id: 2, src: '/image5.JPG' },
    { id: 3, src: '/image6.JPG' },
    { id: 4, src: '/image7.JPG' },
    { id: 5, src: '/image8.JPG' },
    { id: 6, src: '/image3.jpg' },
    { id: 7, src: '/image9.JPG' },
    { id: 8, src: '/image11.JPG' },
  ];
  

  // Simulate admin check (replace with actual logic if needed)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdmin(true); // Assume the user is an admin if a token exists
    }
  }, []);

  // Handle file upload (frontend-only simulation)
  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!isAdmin) {
      setError('Only admins can upload images.');
      return;
    }
    alert('Image uploaded successfully! (Simulated)');
    setFile(null); // Reset file input
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8">Gallery</h1>

      {/* Upload Form (Visible only to admins) */}
      {isAdmin && (
        <form onSubmit={handleUpload} className="max-w-2xl mx-auto">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Upload Image
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto text-center text-red-500 mt-4">
          {error}
        </div>
      )}

      {/* Main Card for Welcome GIF */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl">
          <img
            src="/welcome gicpl.gif" // Updated GIF path
            alt="Welcome GIF"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Display Images in 8 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {placeholderImages.map((image) => (
          <div
            key={image.id}
            className="bg-white p-4 rounded-lg shadow-md transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <img
              src={image.src}
              alt={`Placeholder ${image.id}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
