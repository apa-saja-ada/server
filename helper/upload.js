const multer = require("multer");

exports.configStorage = (location) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, location);
    },
    filename: function (req, file, cb) {
      let uniqueSuffix = Date.now();
      let org_file_name = file.originalname;
      let re_file = org_file_name.split(".");
      let finalName = `${uniqueSuffix}.${re_file[1]}`;
      cb(null, finalName);
    },
  });
};

exports.validation_type = (extension) => {
  return (req, file, cb) => {
    if (extension === "image") {
      let type = file.mimetype == "image/jpeg" || file.mimetype == "image/png";
      if (type) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else {
      console.log(`EXTENSION TYPE CANNOT BE IDENTIFIED! => ${file.mimetype}`);
      cb(null, false);
    }
  };
};
