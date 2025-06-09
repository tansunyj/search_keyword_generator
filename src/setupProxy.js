const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('========== Setting up API Proxy ==========');

  // Add proxy for /api/openai
  app.use(
    '/api/openai',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('[API Proxy] Request:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('[API Proxy] Response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('[API Proxy] Error:', err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Proxy Error',
            message: err.message 
          }));
        }
      }
    })
  );

  console.log('========== API Proxy Setup Complete ==========');
}; 