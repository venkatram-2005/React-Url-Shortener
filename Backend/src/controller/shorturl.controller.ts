import { Request, Response } from "express";
import { generateShortcode } from "../utils/shortcode";
import dayjs from "dayjs";
import { getGeoLocation } from "../utils/location";
import { ShortUrl } from "../models/shorturl.model";

const urlMap = new Map<string, any>();

export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      res.status(400).json({ error: "Invalid or missing URL." });
      return;
    }

    let code = shortcode;

    if (code) {
      const existing = await ShortUrl.findOne({ shortcode: code });
      if (existing) {
        res.status(409).json({ error: "Shortcode already in use." });
        return;
      }
    } else {
      do {
        code = generateShortcode();
      } while (await ShortUrl.findOne({ shortcode: code }));
    }

    const ttlMinutes = typeof validity === "number" ? validity : 30;
    const expiry = dayjs().add(ttlMinutes, "minute").toDate();

    const newShortUrl = await ShortUrl.create({
      shortcode: code,
      originalUrl: url,
      expiry,
    });

    const fullShortUrl = `${req.protocol}://${req.get("host")}/${code}`;

    res.status(201).json({
      shortLink: fullShortUrl,
      expiry: newShortUrl.expiry,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortcode } = req.params;
    const record = await ShortUrl.findOne({ shortcode });

    if (!record) {
      res.status(404).json({ error: "Shortcode not found" });
      return;
    }

    if (dayjs().isAfter(record.expiry)) {
      res.status(410).json({ error: "Shortlink has expired" });
      return;
    }

    record.clickStats.push({
      timestamp: new Date(),
      source: req.get("referer") || "unknown",
      location: getGeoLocation(req.ip || "0.0.0.0"),
    });

    await record.save();

    res.redirect(record.originalUrl);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortcode } = req.params;
    const record = await ShortUrl.findOne({ shortcode });

    if (!record) {
      res.status(404).json({ error: "Shortcode not found" });
      return;
    }

    res.status(200).json({
      originalUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiry: record.expiry,
      clicks: record.clickStats.length,
      clickDetails: record.clickStats,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

