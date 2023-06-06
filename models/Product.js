const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Product = mongoose.model(
	"Product",
	new Schema(
		{
			name: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			qtde: {
				type: Number,
				required: true,
			},
			value: {
				type: Number,
				required: true,
			},
			category: {
				type: String,
			},
			isActive: {
				type: Boolean,
			},
		},
		{ timestamps: true }
	)
);

module.exports = Product;
