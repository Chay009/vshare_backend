const multer = require("multer");

// img storage path
const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    limits: {
        fieldNameSize: 300,
        fileSize: 104857600, // 10 Mb
      },
    filename: (req, file, callback) => {
        
        callback(null, `image-${Date.now()}.${file.originalname}`);
    }
});

// img filter
const isImage = (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Only images (JPEG, PNG, GIF) are allowed"));
    }
};

const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
});

module.exports = { upload };
