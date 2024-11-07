import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Webcam from "react-webcam";

function Post() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();
  const handleCaptionChange = (e) => setCaption(e.target.value);
  const handlePostClick = () => {
    console.log("Post clicked. Caption:", caption);
    alert("Post submitted successfully!");
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1440,
      height: 1080,
    });
    setImage(imageSrc);
  };

  const invalidatePhoto = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className='mx-auto max-w-lg p-4'>
      <h1 className='mb-4 text-center text-2xl font-bold'>
        Report an Incident
      </h1>

      <div className="w-full aspect-[4/3] mb-4 bg-gray-200 rounded flex justify-center items-center">
        {image ? (
          <img
            className="w-full h-full object-cover"
            src={image}
            alt="Captured or Uploaded"
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full"
          />
        )}
      </div>

      {(image && (
        <button
          className="w-full font-semibold text-white py-2 rounded bg-gray-500 hover:bg-gray-700 mb-4"
          onClick={invalidatePhoto}
        >
          Clear Photo
        </button>
      )) || (
        <button
          className="w-full font-semibold text-white py-2 rounded bg-gray-500 hover:bg-gray-700 mb-4"
          onClick={capture}
        >
          Capture Photo
        </button>
      )}

      <div className="image-uploader">
        <button
          className="w-full font-semibold text-white py-2 rounded bg-gray-500 hover:bg-gray-700 mb-4"
          onClick={handleImageClick}
        >
          Upload Photo
        </button>

        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <button className='mb-4 w-full rounded border border-gray-300 bg-emerald-800 p-2 hover:bg-gray-600 hover:transition-all'>
        <span className='font-semibold text-white'>
          Recents <FontAwesomeIcon icon='fa-solid fa-caret-down' />
        </span>
      </button>

      <textarea
        className="w-full align-top resize-none border border-gray-300 p-2 rounded mb-4"
        rows="3"
        placeholder="Write a caption ..."
        value={caption}
        onChange={handleCaptionChange}
      />

      <button
        className='w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700 hover:transition-all'
        onClick={handlePostClick}
      >
        Post
      </button>
    </div>
  );
}

export default Post;
