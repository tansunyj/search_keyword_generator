const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

module.exports = function(app) {
  console.log('========== 设置API代理 ==========');
  
  // 使用body-parser中间件解析JSON请求体
  app.use(bodyParser.json({limit: '10mb'}));
  
  // 添加CORS中间件
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });
  
  // 记录所有请求
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] [请求] ${req.method} ${req.url}`);
    next();
  });
  
  // 处理所有API请求 - 注意这里使用/api前缀而不是具体路径
  app.use('/api', (req, res) => {
    // 提取实际路径，移除/api前缀
    const targetPath = req.url;
    const actualPath = `/v1${targetPath}`;
    
    console.log(`[${new Date().toISOString()}] [API请求] ${req.method} ${req.url} -> https://openkey.cloud${actualPath}`);
    
    // 获取请求体和授权头
    const requestBody = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: '缺少授权头' });
    }
    
    // 准备请求选项
    const options = {
      hostname: 'openkey.cloud',
      port: 443,
      path: actualPath,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'User-Agent': 'Node.js Proxy'
      }
    };
    
    // 创建请求
    const proxyReq = https.request(options, (proxyRes) => {
      console.log(`[${new Date().toISOString()}] [代理响应状态] ${proxyRes.statusCode}`);
      
      // 设置响应头
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      // 收集响应数据
      const chunks = [];
      proxyRes.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      // 完成响应
      proxyRes.on('end', () => {
        const responseData = Buffer.concat(chunks).toString();
        console.log(`[${new Date().toISOString()}] [响应完成] 长度: ${responseData.length}`);
        console.log(`[${new Date().toISOString()}] [响应预览] ${responseData.substring(0, 200)}...`);
        res.end(responseData);
      });
    });
    
    // 处理请求错误
    proxyReq.on('error', (error) => {
      console.error(`[${new Date().toISOString()}] [代理错误] ${error.message}`);
      console.error(error.stack);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: '代理请求失败',
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        }));
      }
    });
    
    // 设置超时（2分钟）
    proxyReq.setTimeout(120000, () => {
      console.error(`[${new Date().toISOString()}] [请求超时] 超过2分钟未响应`);
      proxyReq.destroy();
      if (!res.headersSent) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: '网关超时',
          message: '请求超过2分钟未完成，请稍后再试'
        }));
      }
    });
    
    // 发送请求体
    if (req.method !== 'GET' && req.method !== 'HEAD' && requestBody) {
      const bodyData = JSON.stringify(requestBody);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
    
    proxyReq.end();
  });
  
  console.log('API代理设置完成，监听路径: /api/* -> https://openkey.cloud/v1/*');
  console.log('超时设置: 2分钟 (120000ms)');
  console.log('========== API代理设置完成 ==========');
}; 