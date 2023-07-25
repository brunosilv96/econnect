const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Destination to store the images
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		let folder = "";

		if (!fs.existsSync(`public/images`)) {
			fs.mkdirSync(`public/images`);
		}

		if (req.baseUrl.includes("users")) {
			folder = "users";
			if (!fs.existsSync(`public/images/${folder}`)) {
				fs.mkdirSync(`public/images/${folder}`);
			}
		} else if (req.baseUrl.includes("products")) {
			folder = "products";
			if (!fs.existsSync(`public/images/${folder}`)) {
				fs.mkdirSync(`public/images/${folder}`);
			}
		} else if (req.baseUrl.includes("category")) {
			folder = "category";
			if (!fs.existsSync(`public/images/${folder}`)) {
				fs.mkdirSync(`public/images/${folder}`);
			}
		}

		cb(null, `public/images/${folder}`);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
	},
});

const imageUpload = multer({
	storage: imageStorage,
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			return cb(new Error("Por favor, envie apenas PNG ou JPG!"));
		}
		cb(undefined, true);
	},
});

module.exports = { imageUpload };
