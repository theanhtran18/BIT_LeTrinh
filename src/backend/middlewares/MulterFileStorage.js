const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/Cloudinary.config");

const uploadImage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "T-Coffee-Shop",
    allowed_formats: ["jpg", "png", "jpeg","webp"],
    public_id: (req, file) => {
      return `tcofee_product_${Date.now()}_${file.originalname}`;
    },
    access_mode: "public" 
  },
});

const upload = multer({ storage: uploadImage });

module.exports = upload;