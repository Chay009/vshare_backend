const fs=require('fs')
const cloudinary = require("cloudinary").v2;


          
// cloudinary.config({ 
//   cloud_name: 'dmrz0asbq', 
//   api_key: '196745523484373', 
//   api_secret: 'kdrgDgNTJlgFn0Y6KEFQKk8Crsc' 
// });

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is missing.");
        }

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        console.log("File uploaded on Cloudinary:" ,response);

        // Remove the locally saved temporary file
       
        

        return response.secure_url;
    } catch (error) {
        // Log the error
        console.error("Error uploading file to Cloudinary:", error);

       

        // Return null or handle the error as needed
        return null;
    }
};

module.exports= { uploadOnCloudinary };
