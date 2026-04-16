const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          console.error('Proxy error:', err);
        }
      }
    })
  );
};