require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
// const { connectToMongoDB } = require("./connection");
const session = require("express-session");
const path = require("path");
const user = require("./server/routes/user");
const login = require("./server/routes/login");
// const userRoute = require("./server/routes/userRoute");

const homeRoute = require("./server/routes/homeRoutes");
const PORT = process.env.PORT || 8000;

const db = require("./db");
const router = require("./server/routes");
const isUserAuthenticated = require("./server/MiddleWare/authenticateUser");

// MongoDB connection
db.connect();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Cors
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(cors()); // Use cors middleware for CORS handling


// Session configuration
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: true }
  })
);

// Set view engine
app.set("view engine", "ejs");

// Routes

// app.use("/", userRoute);
app.use("/signup", user);
app.use("/login", login);

app.use(isUserAuthenticated);
// app.use("/", userRoute);
app.use("/api", router);
// app.use("/admin", adminRoute);
app.use("/home", homeRoute);

// Static file serving
app.use(express.static(path.join(__dirname, "../front-end/build")));

// Catch-all route to serve frontend's index.html
app.get("*", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
    } catch (e) {
        res.send("Oops! unexpected Error");
    }
});

// Start server
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
