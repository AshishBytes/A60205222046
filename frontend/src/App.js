import React from 'react';
import { Box } from '@mui/material';
import URLForm from './components/URLForm';
import Stats from './components/Stats';

function App() {
  return (
    <Box sx={{ bgcolor: '#f3f4f6', minHeight: '100vh', py: 5 }}>
      <URLForm />
      <Stats />
    </Box>
  );
}

export default App;
