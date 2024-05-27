const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({ 
    cloud_name: 'dgvjycfkr', 
    api_key: '171233621644175', 
    api_secret: 'YuJjD1Wwq2lH34qoC-nI6OvuPH8' 
  });

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        });

        if (response) {
            console.log("File has been uploaded on Cloudinary:", response.url);
        }

        fs.unlinkSync(localfilepath);

        return response.url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        fs.unlinkSync(localfilepath);
        return null;
    }
};

module.exports = { uploadOnCloudinary };