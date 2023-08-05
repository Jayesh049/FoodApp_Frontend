const { createProxyMiddleware } =
    require('http-proxy-middleware');

module.exports = function (app) {
    app.use("/api",
        createProxyMiddleware({
            // server ke home page ka link
            target: 'https://foodappbackend-lk5m.onrender.com',
            changeOrigin: true,
        })
    );
};
