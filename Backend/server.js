const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
    res.send("<h1>Car Rental Backend is Running 🚗</h1>");
});

// API Route
app.get("/api", (req, res) => {
    res.json({
        message: "Backend Working Successfully"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        error: "Not found"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

