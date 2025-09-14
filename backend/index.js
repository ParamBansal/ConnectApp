import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from "./socket/socket.js";
import path from 'path';
import { fileURLToPath } from "url";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: [
        'https://connectapp-k6fs.onrender.com', // production frontend
        'http://localhost:5173'                 // local dev frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use("/api/v1/message", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
}, messageRoute);

// Serve frontend build
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start server after DB connection
const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
};

startServer();
