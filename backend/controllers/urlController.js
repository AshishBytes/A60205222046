const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

exports.createShortURL = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  if (validity && (isNaN(validity) || validity <= 0)) {
    return res
      .status(400)
      .json({ error: "Validity must be a positive number" });
  }

  const code = shortcode || uuidv4().slice(0, 5);
  const expiry = new Date(Date.now() + validity * 60000).toISOString();

  const exists = urlDB.find((u) => u.code === code);
  if (exists) return res.status(400).json({ error: "Shortcode already used" });
  if (validity && (isNaN(validity) || validity <= 0)) {
    return res
      .status(400)
      .json({ error: "Validity must be a positive number greater than 0" });
  }

  const newURL = {
    url,
    code,
    expiry,
    created: new Date().toISOString(),
    clicks: [],
  };

  urlDB.push(newURL);
  res.status(201).json({
    shortLink: `http://localhost:5000/${code}`,
    expiry,
  });
};

exports.redirectURL = async (req, res) => {
  const code = req.params.code;
  const record = urlDB.find((u) => u.code === code);
  if (!record) return res.status(404).send("Short URL not found.");

  const now = new Date();
  const expiryTime = new Date(record.expiry);

  if (now > expiryTime) {
    return res.status(410).send("This short link has expired.");
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  let location = "Unknown";

  if (!ip.startsWith("::1") && ip !== "127.0.0.1") {
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/country_name/`);
      location = response.data || "Unknown";
    } catch (err) {
      console.warn("Geo IP lookup failed:", err.message);
    }
  }

  record.clicks.push({
    timestamp: new Date().toISOString(),
    source: req.headers.referer || "direct",
    location,
  });

  res.redirect(record.url);
};

exports.getStats = (req, res) => {
  const code = req.params.code;
  const record = urlDB.find((u) => u.code === code);
  if (!record) return res.status(404).json({ error: "Short URL not found." });

  const now = new Date();
  const expiry = new Date(record.expiry);
  const isExpired = now > expiry;

  res.json({
    original: record.url,
    expiry: record.expiry,
    expired: isExpired,
    totalClicks: record.clicks.length,
    clicks: record.clicks,
  });
};

const { urlDB } = require("../models/urlModel");

exports.getAllURLs = (req, res) => {
  res.json(urlDB);
};
