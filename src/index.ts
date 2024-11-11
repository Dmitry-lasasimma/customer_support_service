import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import connectDB from "./config/database";
import faqRoutes from "./routes/faq";
import userGuideRoutes from "./routes/userGuide";
import themeRoutes from "./routes/theme";

dotenv.config();

// Initialize express the Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connected to the MongoDB database
connectDB();

//Routes
app.use("/v1/api/faq", faqRoutes);
app.use("/v1/api/user-guide", userGuideRoutes);
app.use("/v1/api/theme", themeRoutes);

// Set the port for the server
const PORT = process.env.PORT || 9000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
