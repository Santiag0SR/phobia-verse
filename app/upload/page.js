"use client";

import {useState, useCallback, useRef, useEffect} from "react";
import {Description, Dialog, DialogPanel, DialogTitle} from "@headlessui/react";

const UploadPage = () => {
  const [file, setFile] = useState(null); // Store the uploaded image file
  const [uploadedFile, setUploadedFile] = useState(null); // Store the result of the uploaded image
  const [backgroundType, setBackgroundType] = useState(""); // Default to arachnophobia
  const [imageUrl, setImageUrl] = useState(null); // The transformed image with background
  const [loading, setLoading] = useState(false);
  const [transformationStarted, setTransformationStarted] = useState(false);
  const [error, setError] = useState(null);
  const [seed, setSeed] = useState(1); // Initialize seed with 1
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [isModalOpen2, setIsModalOpen2] = useState(false); // Modal open/close state
  let [isOpen, setIsOpen] = useState(false);

  const [currentModalImage, setCurrentModalImage] = useState(null); // Track which image to show in the modal

  // const [showPhobiaImage, setShowPhobiaImage] = useState(false); // Control the phobia image visibility

  const fileInputRef = useRef(null); // Ref to the hidden file input

  const phobiaData = {
    "prompt spiders and tarantulas": {
      name: "Arachnophobia",
      image: "/spider-icon.png",
      description:
        "Arachnophobia is the fear of spiders and other arachnids. This fear is often triggered by the sight of spiders, or even thinking about them. People with arachnophobia might experience extreme discomfort, panic, or anxiety in the presence of spiders, ranging from small household spiders to larger tarantulas. The fear can interfere with daily life, as it may lead to avoiding areas where spiders could be present, such as basements, gardens, or attics.",
    },
    "prompt blood in the walls": {
      name: "Hematophobia",
      image: "/blood-icon.png",
      description:
        "Hematophobia is the fear of blood, causing anxiety and distress. This phobia can be triggered by seeing blood, getting an injury, or even thinking about blood-related situations. People with hematophobia often feel dizzy, nauseous, or faint at the sight of blood, whether it's their own or someone else's. This fear can affect how they handle medical procedures or emergency situations, sometimes leading to avoidance of necessary medical care due to the overwhelming fear of blood exposure.",
    },
    "prompt clowns doing things": {
      name: "Coulrophobia",
      image: "/clown-icon.png",
      description:
        "Coulrophobia is the fear of clowns, often due to their exaggerated features like oversized eyes, painted-on smiles, and brightly colored costumes. These exaggerated characteristics, combined with the unpredictable behavior of clowns, can make them seem menacing rather than entertaining to some individuals. People with coulrophobia may experience intense fear or panic at circuses, parties, or in media featuring clowns, and their fear may be rooted in early childhood experiences or negative depictions of clowns in horror films or popular culture.",
    },
    "prompt skyhigh cliffs endless drop towering buildings with no safety railings and vertigo inducing heights":
      {
        name: "Acrophobia",
        image: "/heights-icon.png",
        description:
          "Acrophobia is the fear of heights, which can cause intense anxiety and panic attacks when an individual is exposed to high places. Whether it's standing at the edge of a cliff, looking out from a tall building, or even seeing images of heights, people with acrophobia may feel vertigo, dizziness, and a strong urge to find safety. This fear can limit activities like hiking, climbing, or traveling in high places, and can sometimes interfere with work or social situations that involve tall structures or elevated areas.",
      },
    "prompt pitch black void eerie shadowy figures emerging dim flickers of distant light":
      {
        name: "Nyctophobia",
        image: "/darkness-icon.png",
        description:
          "Nyctophobia is the fear of darkness or night, often stemming from an intense fear of the unknown or unseen dangers that might lurk in the dark. It is a common childhood fear but can persist into adulthood for some individuals. Those affected may experience anxiety, rapid heartbeat, and distress when in dark environments, whether it's a dimly lit room, a dark alley, or even being outside at night. The fear can lead to difficulty sleeping, especially in completely dark settings, and avoidance of activities or places associated with darkness.",
      },
    "prompt vast deep ocean submerged in dark waters colossal sea creatures lurking below swirling abyss":
      {
        name: "Thalassophobia",
        image: "/ocean-icon.png",
        description:
          "Thalassophobia is the fear of deep bodies of water, particularly oceans, seas, or lakes. People with thalassophobia may feel panic or dread at the thought of the vastness of the water, the creatures that might be lurking beneath the surface, and the inability to see the bottom. This fear can make swimming, boating, or even watching ocean-related media overwhelming. It often stems from the fear of the unknown, the vast depths of the sea, and what might be hiding within it, contributing to feelings of helplessness and isolation in the water.",
      },
    "prompt tight cramped tunnels closing walls locked doors with no escape suffocating spaces":
      {
        name: "Claustrophobia",
        image: "/confined-icon.png",
        description:
          "Claustrophobia is the fear of confined spaces, where the individual feels trapped or suffocated. Common triggers include elevators, small rooms, crowded areas, or even tight clothing. Those with claustrophobia may experience shortness of breath, panic, or a strong desire to escape the enclosed space. This fear can interfere with daily life, as it might cause avoidance of necessary situations, such as taking elevators, using public transport, or visiting places with restricted exits, which can severely limit social and professional activities.",
      },
    "prompt slithering snakes covering the ground coiling around venomous fangs ready to strike hissing sound":
      {
        name: "Ophidiophobia",
        image: "/snake-icon.png",
        description:
          "Ophidiophobia is the fear of snakes, often triggered by their slithering movements, scales, or perceived danger. Even non-venomous snakes can cause significant fear for those with ophidiophobia. People with this fear may avoid places where snakes might live, such as forests, gardens, or pet stores, and may experience extreme anxiety or panic when encountering a snake or even seeing images of one. This phobia can be deeply rooted in evolutionary fears of venomous snakes and their potential threat to survival.",
      },
    "prompt surfaces covered in small tightly packed holes honeycomblike patterns unsettling organic textures":
      {
        name: "Trypophobia",
        image: "/holes-icon.png",
        description:
          "Trypophobia is the fear or discomfort of seeing clusters of small holes, bumps, or repetitive patterns. Common triggers include things like honeycombs, lotus seed pods, or coral. People with trypophobia may feel disgust, anxiety, or discomfort at the sight of these textures, often accompanied by itching or nausea. Though not officially recognized as a phobia, it is a widespread fear that many individuals experience to varying degrees, possibly tied to an aversion to patterns that resemble diseased skin or other dangerous organisms.",
      },
    "prompt invisible germs spreading dirty surfaces magnified bacteria creeping around contaminated environments":
      {
        name: "Mysophobia",
        image: "/germs-icon.png",
        description:
          "Mysophobia is the fear of germs or contamination, often leading to compulsive cleaning or avoidance behaviors. Those with mysophobia may fear contracting illnesses from germs on surfaces, other people, or even the air. This fear can result in excessive hand-washing, avoiding physical contact with others, and steering clear of places perceived to be dirty or unsanitary. Mysophobia can severely impact daily life, leading to obsessive-compulsive behaviors and heightened anxiety in public spaces or healthcare environments.",
      },
    "prompt insects crawling everywhere swarming bugs buzzing flies large winged creatures looming":
      {
        name: "Entomophobia",
        image: "/insect-icon.png",
        description:
          "Entomophobia is the fear of insects, which can range from discomfort around flies and beetles to outright panic at the sight of larger or more threatening-looking bugs, like cockroaches or bees. People with entomophobia may avoid outdoor activities or certain environments where insects are present, and the mere presence of an insect in their home can cause distress. This fear can be debilitating and interfere with daily life, particularly for those living in areas where insects are common, leading to anxiety and avoidance of even harmless creatures.",
      },
    "prompt growling dogs barking echoes sharp teeth in a dark alley packs of feral dogs approaching":
      {
        name: "Cynophobia",
        image: "/dog-icon.png",
        description:
          "Cynophobia is the fear of dogs, leading to significant anxiety even around harmless or friendly dogs. People with cynophobia may have had a traumatic experience with a dog in the past, or their fear may stem from cultural or learned fears. This phobia can manifest as avoidance of parks, public spaces, or homes where dogs are present, and the mere sound of barking may induce panic. It can be particularly challenging in social settings where dogs are commonly seen as pets and companions.",
      },
    "prompt lifelike dolls staring mechanical figures moving slowly haunted doll faces eerie automatons":
      {
        name: "Automatonophobia",
        image: "/doll-icon.png",
        description:
          "Automatonophobia is the fear of humanoid figures, such as dolls, mannequins, robots, or animatronics. The lifelike appearance of these objects, combined with their often unnatural or jerky movements, can evoke a sense of unease or fear. Those with automatonophobia may feel as though these objects are watching or following them, leading to intense discomfort or panic. The fear is often heightened in settings like museums, toy stores, or amusement parks where such figures are commonly displayed.",
      },
    "prompt turbulent skies shaking airplane wings lightning storms while flying view from high altitude":
      {
        name: "Aerophobia",
        image: "/flying-icon.png",
        description:
          "Aerophobia is the fear of flying, often triggered by turbulence, fear of heights, or claustrophobia within the airplane cabin. People with aerophobia may experience extreme anxiety before or during a flight, fearing the plane could crash or that they will be trapped during an emergency. This phobia can make travel difficult, limiting personal or professional opportunities, and can require therapeutic interventions or medication to manage the intense fear during flights.",
      },
    "prompt razorsharp knives pointed needles glistening blades in close proximity sharp spikes everywhere":
      {
        name: "Aichmophobia",
        image: "/sharp-icon.png",
        description:
          "Aichmophobia is the fear of sharp objects, such as knives, needles, or scissors. This phobia can cause individuals to feel panic or anxiety when near sharp tools or objects, fearing injury or harm. Medical procedures involving needles, such as vaccinations or blood tests, can be especially distressing. Aichmophobia can interfere with daily tasks like cooking or even handling household items, as the individual may avoid situations where sharp objects are present, leading to heightened stress in environments like kitchens or medical facilities.",
      },
  };

  // useEffect(() => {
  //   // Reset phobia image visibility whenever the phobia is changed
  //   setShowPhobiaImage(true);
  //   const timer = setTimeout(() => setShowPhobiaImage(false), 3000); // Hide after 3 seconds
  //   return () => clearTimeout(timer);
  // }, [backgroundType]);

  const handleImageUpload = async (selectedFile) => {
    setUploadedFile(null);
    setLoading(true);
    setError(null);

    if (!selectedFile) {
      setError("Please upload a valid image file.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
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
    setImageUrl(null);
    setTransformationStarted(true);
    setIsModalOpen2(true);
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

  // Handle drop event and automatically upload the dropped file
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    handleImageUpload(droppedFile); // Automatically upload the dropped file
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle file selection and automatically upload the selected file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    handleImageUpload(selectedFile); // Automatically upload the selected file
  };

  // Handle click to trigger file input
  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const openModal = (image) => {
    setIsModalOpen(true); // Open the modal
    setCurrentModalImage(image); // Set the current image to show in the modal
  };

  const closeModal = () => {
    setIsModalOpen2(false);
    setCurrentModalImage(null); // Clear the modal image
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url(/fondoManicomio2.webp)] bg-cover bg-no-repeat bg-center">
      <div className="bg-black/70 p-2 sm:p-10 rounded-md z-10 animate-fadeInTitle">
        <h1 className="  animate-fadeInTitle text-lg md:text-3xl font-bold mb-4 text-gray-300 text-center max-w-2xl">
          Upload your photo, <br />
          <span className="font-spooky2 text-red-700">
            {" "}
            bring your phobias to life!
          </span>
        </h1>

        {/* Dropzone for Image Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick} // Handle click to open file input
          className="border-2 border-dashed border-gray-400 p-6 text-center bg-gray-100 hover:bg-gray-200 cursor-pointer max-w-xs sm:max-w-md mx-auto rounded-md"
        >
          {file ? (
            <p className="text-black truncate">{file.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop an image, or click to select one
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileChange} // Automatically upload when a file is selected
            ref={fileInputRef} // Bind the file input to the ref
            className="hidden"
          />
        </div>
        {loading && (
          <p className="mt-4 text-white ">
            Processing your image, please wait...
          </p>
        )}

        {uploadedFile && (
          <div className="flex flex-col md:flex-row mt-4">
            <div className="flex flex-col justify-center items-center max-w-32 mx-auto">
              <img
                src={uploadedFile}
                alt="Uploaded"
                className=" w-28 h-28 object-cover border-2 border-gray-400"
                onClick={() => openModal(uploadedFile)} // Open the modal with the uploaded image
              />
              <p className="text-gray-300">Image uploaded successfully!</p>
            </div>

            <form
              onSubmit={handleApplyBackground}
              className="flex flex-col space-y-4 mt-4 w-full ml-0 md:ml-4"
            >
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value)}
                className="p-2 border"
                required
              >
                <option value="" disabled>
                  Choose your phobia
                </option>
                <option value="prompt turbulent skies shaking airplane wings lightning storms while flying view from high altitude">
                  Aerophobia (Flying)
                </option>
                <option value="prompt skyhigh cliffs endless drop towering buildings with no safety railings and vertigo inducing heights">
                  Acrophobia (Heights)
                </option>
                <option value="prompt razorsharp knives pointed needles glistening blades in close proximity sharp spikes everywhere">
                  Aichmophobia (Sharp Objects)
                </option>
                <option value="prompt spiders and tarantulas">
                  Arachnophobia (Spiders)
                </option>
                <option value="prompt lifelike dolls staring mechanical figures moving slowly haunted doll faces eerie automatons">
                  Automatonophobia (Dolls)
                </option>
                <option value="prompt growling dogs barking echoes sharp teeth in a dark alley packs of feral dogs approaching">
                  Cynophobia (Dogs)
                </option>
                <option value="prompt clowns doing things">
                  Clownphobia (Clowns)
                </option>
                <option value="prompt tight cramped tunnels closing walls locked doors with no escape suffocating spaces">
                  Claustrophobia (Confined Spaces)
                </option>
                <option value="prompt blood in the walls">
                  Hematophobia (Blood)
                </option>
                <option value="prompt insects crawling everywhere swarming bugs buzzing flies large winged creatures looming">
                  Entomophobia (Insects)
                </option>
                <option value="prompt invisible germs spreading dirty surfaces magnified bacteria creeping around contaminated environments">
                  Mysophobia (Germs)
                </option>
                <option value="prompt pitch black void eerie shadowy figures emerging dim flickers of distant light">
                  Nyctophobia (Darkness)
                </option>
                <option value="prompt slithering snakes covering the ground coiling around venomous fangs ready to strike hissing sound">
                  Ophidiophobia (Snakes)
                </option>
                <option value="prompt surfaces covered in small tightly packed holes honeycomblike patterns unsettling organic textures">
                  Trypophobia (Holes)
                </option>
                <option value="prompt vast deep ocean submerged in dark waters colossal sea creatures lurking below swirling abyss">
                  Thalassophobia (Ocean)
                </option>
              </select>

              <button
                type="submit"
                className="bg-red-800 text-white p-2 rounded"
              >
                Apply phobia!
              </button>
            </form>
          </div>
        )}
        {imageUrl && (
          <div className="mt-4 flex flex-col-reverse sm:flex-row">
            <div className="sm:mr-5 flex flex-col">
              <div>
                <p className="text-white">Transformation successful!</p>
                <img
                  src={imageUrl}
                  alt="Transformed image"
                  className="w-full max-w-xs"
                  // onClick={(setIsModalOpen2(true))} // Open the modal with the transformed image
                />
              </div>
              <a
                href={imageUrl} // The image URL to download
                target="_blank"
                download="transformed-image.png" // The file name for the download
                className="text-white bg-green-800 px-4 py-2 rounded mx-auto mt-5"
              >
                Download Image
              </a>
            </div>
            <div>
              <h3 className="mt-4 text-white text-2xl">
                {phobiaData[backgroundType]?.name}
              </h3>
              <p className="mt-4 text-white max-w-xs">
                {phobiaData[backgroundType]?.description}
              </p>
            </div>
          </div>
        )}
        {isModalOpen2 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center h-full w-full overflow-auto"
            onClick={() => setIsModalOpen2(false)} // Close the modal when clicking outside
          >
            <div
              className="relative w-full flex flex-col pt-10 pb-10 mx-auto p-4  rounded-lg overflow-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
              style={{maxHeight: "100vh"}} // Ensure the modal content is constrained within the viewport
            >
              <button
                className="sm:absolute top-5 right-10 text-white text-xs bg-red-800 px-4 py-2 rounded"
                onClick={closeModal} // Close the modal
              >
                Close
              </button>
              {transformationStarted && (
                <div className="flex flex-col justify-center text-center">
                  <h3 className="mt-4 text-white text-2xl">
                    {phobiaData[backgroundType]?.name}
                  </h3>
                  <p className="mt-4 text-white max-w-4xl mx-auto">
                    {phobiaData[backgroundType]?.description}
                  </p>
                </div>
              )}
              {loading && (
                <p className="mt-4 text-white">
                  Processing your image, please wait...
                </p>
              )}
              {error && <p className="mt-4 text-red-500">{error}</p>}

              {imageUrl && (
                <div className="mt-4 flex flex-col items-center justify-center">
                  <p className="text-white">Transformation successful!</p>
                  <img
                    src={imageUrl}
                    alt="Transformed image"
                    className="w-full max-w-2xl"
                  />
                </div>
              )}
              <div className="flex flex-row justify-center items-center mb-10">
                {imageUrl && (
                  <a
                    href={imageUrl} // The image URL to download
                    target="_blank"
                    download="transformed-image.png" // The file name for the download
                    className="text-white bg-green-800 px-4 py-2 rounded mx-2 mt-4"
                  >
                    Download Image
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Phobia Image */}
      {/* {showPhobiaImage && phobiaImages[backgroundType] && (
        <div className="animate-fadeOut absolute inset-0 flex items-center justify-center z-20">
          <img
            src={phobiaImages[backgroundType]}
            alt="Phobia Image"
            className="w-full max-w-xs"
          />
        </div>
      )} */}

      <div className="fixed inset-0 h-full w-full bg-black animate-fadeIn"></div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside the image
        >
          <div className="relative">
            <img
              src={currentModalImage}
              alt="Full Screen Image"
              className="w-full max-w-4xl h-auto rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on the image
            />
            <button
              className="absolute top-2 right-2 text-white bg-red-600 px-4 py-2 rounded"
              onClick={closeModal} // Close the modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
