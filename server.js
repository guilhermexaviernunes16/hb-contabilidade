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

// Dedicated routes for search engines and crawlers
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Fallback to index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 HB Contabilidade Website running on http://${HOST}:${PORT}`);
});
