const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Enable Gzip/Brotli compression for fast asset delivery
app.use(compression());

// Serve static files with caching
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: true
}));

// Fallback to index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 HB Contabilidade Website running on http://${HOST}:${PORT}`);
});
