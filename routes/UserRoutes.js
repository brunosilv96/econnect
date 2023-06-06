const router = require("express").Router();

// Controllers
const UserController = require("../controllers/UserController");

// Middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", UserController.register);

module.exports = router;
