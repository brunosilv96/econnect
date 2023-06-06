const express = require("express");
const cors = require("cors");

// Routes
const UserRoutes = require("./routes/UserRoutes.js");

// Start EXPRESS
const app = express();

// Resolve JSON
app.use(express.json());

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Public folders from images
app.use(express.static("public"));

app.use("/users", UserRoutes);

app.listen(5000);
