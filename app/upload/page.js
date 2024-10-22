"use client";

import {useState, useCallback, useRef} from "react";

const UploadPage = () => {
  const [file, setFile] = useState(null); // Store the uploaded image file
  const [uploadedFile, setUploadedFile] = useState(null); // Store the result of the uploaded image
  const [backgroundType, setBackgroundType] = useState(
    "prompt spiders and tarantulas"
  ); // Default to arachnophobia
  const [imageUrl, setImageUrl] = useState(null); // The transformed image with background
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(1); // Initialize seed with 1

  const fileInputRef = useRef(null); // Ref to the hidden file input

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setUploadedFile(null);
    setLoading(true);
    setError(null);

    if (!file) {
      setError("Please upload a valid image file.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: reader.result,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setUploadedFile(result.data.url); // Use result.data.url (secure_url from Cloudinary)
        setError(null);
      } else {
        setError("Image upload failed.");
      }
      setLoading(false);
    };
  };

  const handleApplyBackground = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!uploadedFile) {
      setError("Please upload an image first.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/background", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: uploadedFile, // Use the uploaded image file
        backgroundType,
        seed, // Apply the selected background
      }),
    });

    const result = await res.json();
    if (result.success) {
      setImageUrl(result.data); // Set the transformed image URL
      setSeed(seed + 1); // Increment the seed for the next transformation
    } else {
      setError("Background transformation failed.");
    }
    setLoading(false);
  };

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle click to trigger file input
  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url(/fondoManicomio2.webp)] bg-cover bg-no-repeat bg-center ">
      <div className="bg-white/60 p-2 sm:p-10 rounded-md z-10 animate-fadeInTitle">
        <h1 className="  animate-fadeInTitle text-lg md:text-4xl font-spooky2 font-bold mb-4 text-red-700 text-center max-w-2xl">
          Upload your photo and live your phobias!
        </h1>

        {/* Dropzone for Image Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick} // Handle click to open file input
          className="border-2 border-dashed border-gray-400 p-6 text-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          {file ? (
            <p className="text-black">{file.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop an image, or click to select one
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileInputRef} // Bind the file input to the ref
            className="hidden"
          />
        </div>

        {/* Form to Upload Image */}
        <form
          onSubmit={handleImageUpload}
          className="flex flex-col space-y-4 animate-fadeInTitle mt-4"
        >
          <button
            type="submit"
            className={` text-white p-2 rounded ${
              loading ? "bg-gray-400 pointer-events-none" : "bg-zinc-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        {uploadedFile && (
          <>
            <div className="mt-4">
              <p>Image uploaded successfully!</p>
              <img
                src={uploadedFile}
                alt="Uploaded"
                className="w-full max-w-xs"
              />
            </div>

            {/* Select Background and Apply */}
            <form
              onSubmit={handleApplyBackground}
              className="flex flex-col space-y-4 mt-4"
            >
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value)}
                className="p-2 border"
              >
                <option value="prompt spiders and tarantulas">
                  Arachnophobia (Spiders)
                </option>
                <option value="prompt blood in the walls">
                  Hematophobia (Blood)
                </option>
                <option value="prompt clowns doing things">
                  Clownphobia (Clowns)
                </option>
              </select>

              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded"
              >
                Apply phobia!
              </button>
            </form>
          </>
        )}

        {loading && (
          <p className="mt-4">Processing your image, please wait...</p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {imageUrl && (
          <div className="mt-4">
            <p>Transformation successful!</p>
            <img
              src={imageUrl}
              alt="Transformed image"
              className="w-full max-w-xs"
            />
          </div>
        )}
      </div>
      <div className="absolute inset-0 h-full w-full bg-black animate-fadeIn"></div>
    </div>
  );
};

export default UploadPage;
