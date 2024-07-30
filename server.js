const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const proxyConfig = {
    target: 'http://iditvshana01.ag-it.com',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'));
    },
    onError: (err, req, res) => {
        res.status(500).json({ error: 'Proxy error', details: err });
    }
};

app.use('/sap/opu/odata', createProxyMiddleware(proxyConfig));

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
