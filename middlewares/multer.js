const multer = require("multer");
const { configStorage, validation_type } = require("../helper/upload");

exports.uploadFile = (path) => {
  return (req, res, next) => {
    const upload = multer({
      storage: configStorage(path),
      fileFilter: validation_type("image"),
      limits: { fileSize: 5242880 },
    }).array("photo", 5); // Maksimum 5 file, sesuaikan dengan kebutuhan Anda.

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(`ERROR WITH INSTANCEOF MULTER`);
        console.error(err.message);
        return res.status(400).json({
          status: false,
          code: 400,
          message: err.message,
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(`ERROR ANOTHER WITHOUT INSTANCEOF MULTER`);
        console.error(err);
        return res.status(400).json({
          status: false,
          code: 400,
          message: err.message,
          // errors: err
        });
      }
      next();
    });
  };
};
