import mongoose from "mongoose";

const clickStatsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: String,
  location: String,
});

const shortUrlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clickStats: [clickStatsSchema],
});

export const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
