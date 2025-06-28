import express, { Request, Response, ErrorRequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();

import shortUrlRoutes from "./route/shorturl.route"; 
import { handleRedirect } from "./controller/shorturl.controller";
import { connectToMongoDB } from "./db/mongodb";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/shorturls", shortUrlRoutes);
app.get("/:shortcode", handleRedirect);

app.get('/', (req: Request, res: Response) => {
  res.send("API is working fine...");
});

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(globalErrorHandler);

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
