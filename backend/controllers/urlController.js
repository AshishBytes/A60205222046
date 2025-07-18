const { v4: uuidv4 } = require("uuid");

exports.createShortURL = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  const code = shortcode || uuidv4().slice(0, 5);
  const expiry = new Date(Date.now() + validity * 60000).toISOString();

  const exists = urlDB.find((u) => u.code === code);
  if (exists) return res.status(400).json({ error: "Shortcode already used" });

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

exports.redirectURL = (req, res) => {
  const code = req.params.code;
  const record = urlDB.find((u) => u.code === code);
  if (!record) return res.status(404).send("Not Found");

  record.clicks.push({
    timestamp: new Date().toISOString(),
    source: req.headers.referer || "direct",
    location: "N/A",
  });
  res.redirect(record.url);
};

exports.getStats = (req, res) => {
  const code = req.params.code;
  const record = urlDB.find((u) => u.code === code);
  if (!record) return res.status(404).json({ error: "Not found" });

  res.json({
    original: record.url,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clicks: record.clicks,
  });
};

const { urlDB } = require("../models/urlModel");

exports.getAllURLs = (req, res) => {
  res.json(urlDB);
};
