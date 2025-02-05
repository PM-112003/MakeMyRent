const cloudinary = require('cloudinary').v2;
console.log("Cloudinary Config:", cloudinary.config());
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Joining cloudinary with backend 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_dev',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });


  module.exports = {
    cloudinary,
    storage
  };