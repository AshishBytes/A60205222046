import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
} from "@mui/material";
import api from "../api/api";

const Stats = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);
  const [allLinks, setAllLinks] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      alert("Stats not found for this shortcode.");
      setStats(null);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/allurls");
        setAllLinks(res.data);
      } catch (err) {
        console.error("Could not fetch all URLs");
      }
    };
    fetchAll();
  }, []);

  return (
    <Paper
      elevation={5}
      sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 4, borderRadius: 3 }}
    >
      <Typography variant="h5" gutterBottom>
        📊 Short URL Statistics
      </Typography>

      <TextField
        fullWidth
        label="Enter Shortcode"
        variant="outlined"
        sx={{ mb: 2 }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mb: 3, fontWeight: "bold" }}
        onClick={fetchStats}
      >
        Fetch Stats
      </Button>

      {stats && (
  <Box sx={{ mb: 4 }}>
    <Typography>
      <strong>Original URL:</strong>{' '}
      <a href={stats.original} target="_blank" rel="noreferrer">
        {stats.original}
      </a>
    </Typography>

    <Typography>
      <strong>Short URL:</strong>{' '}
      <a
        href={`http://localhost:5000/${code}`}
        target="_blank"
        rel="noreferrer"
      >
        http://localhost:5000/{code}
      </a>
    </Typography>

    <Typography>
      <strong>Expires:</strong>{' '}
      {new Date(stats.expiry).toLocaleString()}
    </Typography>

    <Typography>
      <strong>Total Clicks:</strong> {stats.totalClicks}
    </Typography>

    <Typography color={stats.expired ? 'error' : 'green'}>
      {stats.expired ? '⛔ This link has expired' : '✅ Active'}
    </Typography>


          <List>
            {stats.clicks.map((click, index) => (
              <div key={index}>
                <ListItem>
                  <Typography>
                    <strong>{index + 1}.</strong> {click.timestamp} | Source:{" "}
                    {click.source} | Location: {click.location || '🌐 Unknown'}

                  </Typography>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        📂 All Shortened URLs
      </Typography>

      <List>
        {allLinks.map((item, index) => {
          const isExpired = new Date(item.expiry) < new Date();

          return (
            <div key={index}>
              <ListItem>
                <Typography variant="body2" component="div">
                  🔗 <strong>{item.code}</strong> →{" "}
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.url}
                  </a>
                  <br />
                  📅 Created:{" "}
                  {item.created
                    ? new Date(item.created).toLocaleString()
                    : "N/A"}
                  <br />⏰ Expires: {new Date(item.expiry).toLocaleString()}
                  <br />
                  👁️ Clicks: {item.clicks.length}
                  <br />
                  {isExpired ? (
                    <span style={{ color: "red" }}>
                      ⛔ This link has expired
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>✅ Active</span>
                  )}
                </Typography>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
    </Paper>
  );
};

export default Stats;
