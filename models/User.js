const mongoose = require("../db/conn");
const { Schema } = mongoose;

const User = mongoose.model(
	"User",
	new Schema(
		{
			name: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			password: {
				type: String,
				required: true,
			},
			image: {
				type: String,
			},
			phone: {
				type: String,
				required: true,
			},
			privileges: {
				type: String,
				required: true,
			},
			adress: {
				postalcode: { type: String },
				adress: { type: String },
				number: { type: String },
				city: { type: String },
				neighborhood: { type: String },
			},
		},
		{ timestamps: true }
	)
);

module.exports = User;
