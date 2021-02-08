var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/therapy_audios");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

// exports.upload =
//   (req,
//   res,
//   function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//       next();
//     } else if (err) {
//       return res.status(500).json(err);
//       next();
//     }
//     res.status(200).send(req.file);
//     next();
//   });

exports.uploadFile = async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      res.status(200).send(req.file);
      next();
    });
  } catch (err) {
    next(err);
  }
};
