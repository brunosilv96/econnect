const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ObjectId = require("mongoose").Types.ObjectId;

// Import helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
	static async register(req, res) {
		console.log("Função: users/register");

		const { name, email, phone, cpf, password, newPassword } = req.body;
		let { privileges } = req.body;

		// Validations
		if (!name) {
			res.status(422).json({ message: "O nome é obrigatório" });
			return;
		}
		if (!cpf) {
			res.status(422).json({ message: "O CPF é obrigatório" });
			return;
		}
		if (!phone) {
			res.status(422).json({ message: "O telefone é obrigatório" });
			return;
		}
		if (!email) {
			res.status(422).json({ message: "O email é obrigatório" });
			return;
		}
		if (!password) {
			res.status(422).json({ message: "A senha é obrigatória" });
			return;
		}
		if (!newPassword) {
			res.status(422).json({
				message: "A confirmação de senha é obrigatória",
			});
			return;
		}
		if (password !== newPassword) {
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
			cpf,
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

	static async registerAdress(req, res) {
		const { postalcode, adressName, number, city, neighborhood } = req.body;

		if (!postalcode) {
			res.status(422).json({ message: "O CEP é obrigatório" });
			return;
		}
		if (!adressName) {
			res.status(422).json({ message: "O endereço é obrigatório" });
			return;
		}
		if (!number) {
			res.status(422).json({ message: "O número é obrigatório" });
			return;
		}
		if (!city) {
			res.status(422).json({ message: "A cidade é obrigatória" });
			return;
		}
		if (!neighborhood) {
			res.status(422).json({ message: "O bairro é obrigatório" });
			return;
		}

		// Search a owner
		const token = getToken(req);
		const user = await getUserByToken(token);

		// Create a user
		const adress = new User({
			postalcode,
			adressName,
			number,
			city,
			neighborhood,
			complement,
			user: {
				_id: user.id,
				cpf: user.cpf,
				name: user.name,
				email: user.email,
				phone: user.phone,
			},
		});

		try {
			const newUser = await adress.save();

			// await createUserToken(newUser, req, res);
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}

	static async login(req, res) {
		console.log("Função: users/login");

		const { email, password } = req.body;

		if (!email) {
			res.status(422).json({ message: "O email é obrigatório" });
			return;
		}

		if (!password) {
			res.status(422).json({ message: "A senha é obrigatória" });
			return;
		}

		// Check if user exist
		const user = await User.findOne({ email: email });

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado" });
			return;
		}

		// Check if password match from password BD
		const machtPass = await bcrypt.compare(password, user.password);

		if (!machtPass) {
			res.status(422).json({ message: "As senhas não condizem" });
			return;
		}

		await createUserToken(user, req, res);
	}

	static async checkUser(req, res) {
		console.log("Função: users/checkuser");

		let correntUser;

		if (req.headers.authorization) {
			const token = getToken(req);
			const decoded = jwt.verify(token, "econnectsecret");

			correntUser = await User.findById(decoded.id);

			correntUser.password = undefined;
		} else {
			correntUser = null;
		}

		res.status(200).send(correntUser);
	}

	static async getUserById(req, res) {
		console.log("Função: users/getUserById");

		const id = req.params.id;

		const user = await User.findById(id).select("-password");

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado" });
			return;
		}

		res.status(200).json({ user });
	}

	static async editUserById(req, res) {
		console.log("Função: users/editUserById");

		const id = req.params.id;

		const token = getToken(req);
		const user = await getUserByToken(token);

		const { name, email, phone, password, confirmpassword } = req.body;
		let { privileges } = req.body;

		if (req.file) {
			user.image = req.file.filename;
		}

		// Validadions
		if (!name) {
			res.status(422).json({ message: "O nome é obrigatório" });
			return;
		}

		user.name = name;

		if (!email) {
			res.status(422).json({ message: "O e-mail é obrigatório" });
			return;
		}

		// Check if email has already taken
		const userExist = await User.findOne({ email: email });

		if (user.email !== email && userExist) {
			res.status(422).json({ message: "Ultilize um e-mail diferente" });
			return;
		}

		user.email = email;

		if (!phone) {
			res.status(422).json({ message: "O telefone é obrigatório" });
			return;
		}

		user.phone = phone;

		if (!privileges) {
			privileges = "User";
		}

		user.privileges = privileges;

		if (password !== confirmpassword) {
			res.status(422).json({ message: "As senhas não condizem" });
			return;
		} else if (password === confirmpassword && password != null) {
			// Updating a password
			const salt = await bcrypt.genSalt(12);
			const passwordHash = await bcrypt.hash(password, salt);

			user.password = passwordHash;
		}

		try {
			// Return users updated data
			await User.findOneAndUpdate({ _id: user.id }, { $set: user }, { new: true });

			res.status(200).json({
				message: "Usuário atualizado com sucesso!",
			});
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}

	static async newAdress(req, res) {
		console.log("Função: user/newAdress");

		const id = req.params.id;
		let { postalcode, adress, number, city, neighborhood } = req.body;

		if (!ObjectId.isValid(id)) {
			res.status(404).json({ message: "ID informado está inválido" });
			return;
		}

		let user = await User.findOne({ _id: id }).select("-password");

		if (!user) {
			res.status(404).json({
				message: "ID de usuário inválido ou não encontrado",
			});
			return;
		}

		if (!postalcode) {
			res.status(422).json({
				message: "O CEP é obrigatório (postalcode)",
			});
			return;
		}
		if (!adress) {
			res.status(422).json({
				message: "A rua é obrigatória (adress)",
			});
			return;
		}
		if (!number) {
			res.status(422).json({
				message: "O numero da residencia é obrigatório (number)",
			});
			return;
		}
		if (!city) {
			res.status(422).json({
				message: "A cidade é obrigatória (city)",
			});
			return;
		}
		if (!neighborhood) {
			res.status(422).json({
				message: "O bairro é obrigatório (neighborhood)",
			});
			return;
		}

		try {
			const newAdress = {
				postalcode,
				adress,
				number,
				city,
				neighborhood,
			};

			user.adress = newAdress;

			await User.findOneAndUpdate({ _id: user._id.toString() }, { $set: user }, { new: true });

			res.status(200).json({
				message: "Endereço cadastrado com sucesso!",
				user,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: error });
		}
	}
};
