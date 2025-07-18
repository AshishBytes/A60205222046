import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../api/api';

const URLForm = () => {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortLink, setShortLink] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await api.post('/shorten', {
        url,
        shortcode,
        validity: Number(validity)
      });
      setShortLink(res.data.shortLink);
    } catch (error) {
      console.error(error);
      alert("Failed to shorten URL");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>

      <TextField
        fullWidth
        label="Long URL"
        variant="outlined"
        margin="normal"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <TextField
        fullWidth
        label="Shortcode (optional)"
        variant="outlined"
        margin="normal"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />
      <TextField
        fullWidth
        label="Validity in Minutes (optional)"
        variant="outlined"
        type="number"
        margin="normal"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Generate Short Link
      </Button>

      {shortLink && (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Short Link: <a href={shortLink} target="_blank" rel="noreferrer">{shortLink}</a>
        </Typography>
      )}
    </Box>
  );
};

export default URLForm;
