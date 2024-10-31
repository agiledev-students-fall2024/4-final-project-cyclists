import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Post() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handlePostClick = () => {
    console.log('Post clicked. Caption:', caption);
    alert('Post submitted successfully!');
  };

  return (
    <div className="relative h-screen w-full pt-10">
      <h1 className="text-center text-2xl font-bold mt-2 mb-4">
        Report an Incident
      </h1>
      <div className="image-uploader">
        <div
          className={`w-full rounded h-64 mb-4 border-2 border-dashed flex justify-center items-center cursor-pointer ${
            image ? '' : 'bg-gray-100'
          }`}
          onClick={handleImageClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-500">
              Click or drag and drop to upload an image
            </p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <button className="w-full bg-emerald-800 hover:transition-all hover:bg-gray-600 border border-gray-300 p-2 rounded mb-4">
        <span className="font-semibold text-white">
          Recents <FontAwesomeIcon icon="fa-solid fa-caret-down" />
        </span>
      </button>

      <textarea
        className="w-full align-top	resize-none border border-gray-300 p-2 rounded mb-4"
        rows="3"
        placeholder="Write a caption ..."
        value={caption}
        onChange={handleCaptionChange}
      />

      <button
        className="w-full font-semibold text-white py-2 rounded bg-gray-500 hover:transition-all hover:bg-gray-700"
        onClick={handlePostClick}
      >
        Post
      </button>
    </div>
  );
}

export default Post;
