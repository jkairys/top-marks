const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS and ORB headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  // Optionally add:
  // res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  // res.header('Cross-Origin-Opener-Policy', 'same-origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  '/bom-wms',
  createProxyMiddleware({
    target: 'http://wvs4.bom.gov.au',
    changeOrigin: true,
    pathRewrite: {
      '^/bom-wms': '',
    },
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Cross-Origin-Resource-Policy'] = 'cross-origin';
    },
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
