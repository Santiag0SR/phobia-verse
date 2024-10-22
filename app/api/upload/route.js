import cloudinary from "../../../lib/cloudinary";

export async function POST(req) {
  try {
    // Parse the incoming request body to get the image data
    const body = await req.json();
    const fileStr = body.data;

    // Check if the file data exists
    if (!fileStr) {
      return new Response(
        JSON.stringify({success: false, error: "No file data provided"}),
        {
          status: 400,
        }
      );
    }

    // Attempt to upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "upload-unsigned-images", // Replace with your actual preset
    });

    // Extract the secure_url from the response to return to the frontend
    const imageUrl = uploadResponse.secure_url;

    // Return a successful response with the image URL
    return new Response(
      JSON.stringify({success: true, data: {url: imageUrl}}), // Send back only the URL
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Upload Error:", error);

    // Return an error response
    return new Response(
      JSON.stringify({success: false, error: "Something went wrong"}),
      {
        status: 500,
      }
    );
  }
}
