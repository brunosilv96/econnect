const mongoose = require("mongoose");

async function main() {
	await mongoose.connect(`mongodb://0.0.0.0:27017/econnect`);
	console.log(`DB conectado: mongodb://0.0.0.0:27017/econnect`);
}

main().catch((err) => console.log(err));

module.exports = mongoose;
