import cloudinary from "../../../lib/cloudinary";

// Helper function to check if the image is processed
async function checkImageProcessing(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true; // The image is ready
    }
    return false;
  } catch (error) {
    return false; // Still processing or an error occurred
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const fileStr = body.data; // Base64 image file
    const fromPrompt = body.fromPrompt; // From object
    const toPrompt = body.toPrompt; // To object
    const preserveGeometry = body.preserveGeometry || false;
    const detectMultiple = body.detectMultiple || false;

    // Step 1: Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "upload-unsigned-images", // Replace with your upload preset
    });
    const publicId = uploadResponse.public_id; // Get the public_id

    // Step 2: Apply the Generative Replace transformation
    const transformedUrl = cloudinary.url(publicId, {
      transformation: [
        {
          effect: `gen_replace:from_${fromPrompt};to_${toPrompt}${
            preserveGeometry ? ";preserve-geometry_true" : ""
          }${detectMultiple ? ";multiple_true" : ""}`,
        },
      ],
    });

    // Step 3: Poll the URL to check if the transformation is complete
    let isProcessed = false;
    const maxAttempts = 20; // Set a maximum number of polling attempts
    const delay = 1000; // 1-second delay between attempts
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(transformedUrl);
      if (isProcessed) {
        break; // If the image is ready, stop polling
      }
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait 1 second
    }

    // If the image is still not processed after polling
    if (!isProcessed) {
      return new Response(JSON.stringify({error: "Image processing failed"}), {
        status: 500,
      });
    }

    // If processed, return the transformed image URL
    return new Response(JSON.stringify({success: true, data: transformedUrl}), {
      status: 200,
    });
  } catch (error) {
    console.error("Generative Replace Error:", error);
    return new Response(
      JSON.stringify({success: false, error: error.message}),
      {
        status: 500,
      }
    );
  }
}
