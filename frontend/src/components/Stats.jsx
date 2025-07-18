import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import api from "../api/api";

const Stats = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);
  const [allLinks, setAllLinks] = useState([]);

  // Fetch all shortened URLs on load
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/allurls");
        setAllLinks(res.data);
      } catch (error) {
        console.error("Failed to fetch all shortened URLs");
      }
    };
    fetchAll();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      alert("Stats not found for this shortcode.");
      setStats(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Short URL Statistics
      </Typography>

      <TextField
        fullWidth
        label="Enter Shortcode"
        variant="outlined"
        margin="normal"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button variant="contained" onClick={fetchStats} sx={{ mt: 2 }}>
        Fetch Stats
      </Button>

      {stats && (
        <Box sx={{ mt: 4 }}>
          <Typography>
            <strong>Original URL:</strong> {stats.original}
          </Typography>
          <Typography>
            <strong>Expires:</strong> {stats.expiry}
          </Typography>
          <Typography>
            <strong>Total Clicks:</strong> {stats.totalClicks}
          </Typography>

          <List>
            {stats.clicks.map((click, index) => (
              <div key={index}>
                <ListItem>
                  <Typography>
                    <strong>{index + 1}.</strong> {click.timestamp} | Source:{" "}
                    {click.source} | Location: {click.location}
                  </Typography>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      )}

      {/* All URL Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          All Shortened URLs
        </Typography>
        <List>
          {allLinks.map((item, index) => (
            <div key={index}>
              <ListItem>
                <Typography variant="body2">
                  🔗 <strong>{item.code}</strong> → {item.url} <br />
                  📅 Created: {new Date(item.created).toLocaleString()} <br />
                  ⏰ Expires: {new Date(item.expiry).toLocaleString()} <br />
                  👁️ Clicks: {item.clicks.length}
                </Typography>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Stats;
