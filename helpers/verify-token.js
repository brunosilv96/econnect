const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

// Middleware to validate token
const checkToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res
			.status(401)
			.json({ message: "Token de acesso não informado!" });
	}

	const token = getToken(req);

	if (!token) {
		return res
			.status(401)
			.json({ message: "Token de acesso não informado!" });
	}

	try {
		const verified = jwt.verify(token, "econnectsecret");
		req.user = verified;
		next();
	} catch (error) {
		return res.status(400).json({ message: "Token inválido!" });
	}
};

module.exports = checkToken;
