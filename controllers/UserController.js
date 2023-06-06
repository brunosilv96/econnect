const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
	static async register(req, res) {
		console.log("Função: users/register");

		const { name, email, phone, password, confirmpassword } = req.body;
		let { privileges } = req.body;

		// Validations
		if (!name) {
			res.status(422).json({ message: "O nome é obrigatório" });
			return;
		}
		if (!email) {
			res.status(422).json({ message: "O email é obrigatório" });
			return;
		}
		if (!phone) {
			res.status(422).json({ message: "O telefone é obrigatório" });
			return;
		}
		if (!password) {
			res.status(422).json({ message: "A senha é obrigatória" });
			return;
		}
		if (!confirmpassword) {
			res.status(422).json({
				message: "A confirmação de senha é obrigatória",
			});
			return;
		}
		if (password !== confirmpassword) {
			res.status(422).json({ message: "As senhas não condizem" });
			return;
		}
		if (!privileges) {
			privileges = "User";
		}

		// Check if user exist
		const userExist = await User.findOne({ email: email });

		if (userExist) {
			res.status(422).json({ message: "E-mail já cadastrado" });
			return;
		}

		// Create a password
		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(password, salt);

		// Create a user
		const user = new User({
			name,
			email,
			phone,
			password: passwordHash,
			privileges,
		});

		try {
			const newUser = await user.save();

			await createUserToken(newUser, req, res);
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}
};
