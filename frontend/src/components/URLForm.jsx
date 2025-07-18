import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import api from '../api/api';

const Shortener = () => {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [shortLink, setShortLink] = useState(null);

const handleSubmit = async () => {
  if (!url.trim()) return alert("Please enter a long URL.");
  if (!/^https?:\/\/.+\..+/.test(url)) return alert("Please enter a valid URL (starting with http:// or https://).");
  if (validity && isNaN(validity)) return alert("Validity must be a number.");

  try {
    const res = await api.post('/shorten', {
      url,
      shortcode,
      validity: validity ? parseInt(validity) : undefined
    });
    setShortLink(res.data.shortLink);
  } catch (err) {
    if (err.response && err.response.data?.error) {
      alert(err.response.data.error);
    } else {
      alert("Something went wrong. Please try again.");
    }
  }
};

  return (
    <Paper elevation={5} sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>🔗 URL Shortener</Typography>

      <TextField
        fullWidth
        label="Long URL"
        variant="outlined"
        sx={{ mb: 2 }}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <TextField
        fullWidth
        label="Shortcode (optional)"
        variant="outlined"
        sx={{ mb: 2 }}
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />

      <TextField
        fullWidth
        label="Validity in Minutes (optional)"
        variant="outlined"
        sx={{ mb: 2 }}
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
      />

      <Button variant="contained" fullWidth sx={{ fontWeight: 'bold' }} onClick={handleSubmit}>
        Generate Short Link
      </Button>

      {shortLink && (
        <Typography sx={{ mt: 3 }}>
          <strong>Short Link:</strong>{' '}
          <a href={shortLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>
            {shortLink}
          </a>
        </Typography>
      )}
    </Paper>
  );
};

export default Shortener;
