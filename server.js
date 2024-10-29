const express = require("express");
const dotEnv = require("dotenv");
const { MongoClient } = require("mongodb");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

dotEnv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
let db;

// Connect to MongoDB
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        db = client.db("Tutorials"); // Use your database name
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });

// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Additional routes for other HTML files
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Registration Route
app.post("/register", async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { fullName, email, password: hashedPassword };

        console.log("User data being saved:", user); // Debugging: Log user data

        await db.collection("users").insertOne(user);
        console.log("User registered successfully"); // Confirm registration success
        res.redirect("/login");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ email });

        console.log("User found:", user); // Debugging: Log found user data

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password comparison result:", isMatch); // Debugging: Log password match result

            if (isMatch) {
                console.log("Login successful");
                res.redirect("/profile");
            } else {
                console.log("Invalid password"); // Log if password does not match
                res.send("Invalid email or password");
            }
        } else {
            console.log("No user found with this email"); // Log if no user found
            res.send("Invalid email or password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});

app.listen(PORT, () => {
    console.log(`Server started and running at http://localhost:${PORT}`);
});
