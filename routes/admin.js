const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { uploadFile } = require("../middlewares/multer");

// * User
const UserController = require("../controllers/user");

router.post("/user", UserController.createUser);
router.post("/login", UserController.login);

router.use(auth);

// * History
const HistoryController = require("../controllers/history");

router.get("/history", HistoryController.getHistoryList);

// * Car
const CarController = require("../controllers/car");

router.post("/car", uploadFile("public/uploads/cars"), CarController.createCar);
router.get("/car", CarController.getCarList);
router.get("/car/:id", CarController.carDetail);
router.put(
  "/car/:id",
  authorize,
  uploadFile("public/uploads/cars"),
  CarController.editCar
);
router.patch("/car/:id", authorize, CarController.changeStatusCar);

module.exports = router;
