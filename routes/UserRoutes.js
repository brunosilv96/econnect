const router = require("express").Router();

// Controllers
const UserController = require("../controllers/UserController");

// Middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);

// Protected routers
router.patch(
	"/edit/:id",
	verifyToken,
	imageUpload.single("image"),
	UserController.editUserById
);

router.post("/newadress/:id", verifyToken, UserController.newAdress);

module.exports = router;
