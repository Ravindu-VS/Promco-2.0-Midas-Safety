// Development only: forwards /api requests from the React dev server to the ASP.NET Core backend,
// so the browser talks to a single origin (no CORS or HTTPS certificate setup needed).
// Override the target with BACKEND_URL, e.g. BACKEND_URL=https://localhost:5001
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BACKEND_URL || 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    })
  );
};
