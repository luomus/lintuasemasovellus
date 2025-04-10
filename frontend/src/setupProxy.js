const { createProxyMiddleware } = require("http-proxy-middleware"); // eslint-disable-line @typescript-eslint/no-require-imports

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000/api",
      changeOrigin: true,
    })
  );
};
