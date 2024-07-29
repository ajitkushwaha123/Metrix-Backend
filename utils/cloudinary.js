import cloudinary from "cloudinary"; // Import without the alias
import fs from "fs";

cloudinary.config({
  cloud_name: "drku1djt5",
  api_key: "346414787548979",
  api_secret: "FvALE4F1Cs0Xi1MG0bs0vvCuX7U",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // No need to upload again; multer-storage-cloudinary already did it
    // Just return the response from multer

    console.log("Image uploaded successfully", localFilePath);
    return localFilePath; // Return the file path or any other relevant data
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
