/**
 * 独立代理服务器 - 用于转发AI API请求
 * 使用方法: node proxy-server.js
 */

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 日志中间件
app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));

// 解析JSON请求体，限制大小为10MB
app.use(bodyParser.json({ limit: '10mb' }));

// CORS中间件 - 修复CORS配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 处理所有API请求
app.use('/api', (req, res) => {
  const startTime = Date.now();
  const targetPath = req.url;
  const actualPath = `/v1${targetPath}`;
  
  console.log(`[${new Date().toISOString()}] [请求开始] ${req.method} ${req.url}`);
  console.log(`[${new Date().toISOString()}] [转发到] https://openkey.cloud${actualPath}`);
  
  // 获取请求体和授权头
  const requestBody = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.error(`[${new Date().toISOString()}] [错误] 缺少授权头`);
    return res.status(401).json({ 
      error: '缺少授权头',
      message: '请提供有效的API密钥' 
    });
  }
  
  // 记录请求体（限制长度）
  if (requestBody && Object.keys(requestBody).length > 0) {
    console.log(`[${new Date().toISOString()}] [请求体预览] ${JSON.stringify(requestBody).substring(0, 200)}...`);
  }
  
  // 准备请求选项
  const options = {
    hostname: 'api.deepseek.com',
    port: 443,
    path: actualPath,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'User-Agent': 'AI-Keywords-Generator-Proxy/1.0'
    }
  };
  
  // 创建请求
  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`[${new Date().toISOString()}] [目标响应] ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
    
    // 设置响应头
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'access-control-allow-origin') {  // 避免重复设置CORS头
        res.setHeader(key, proxyRes.headers[key]);
      }
    });
    res.statusCode = proxyRes.statusCode;
    
    // 收集响应数据
    const chunks = [];
    proxyRes.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    // 完成响应
    proxyRes.on('end', () => {
      const responseData = Buffer.concat(chunks).toString();
      const elapsedTime = Date.now() - startTime;
      
      console.log(`[${new Date().toISOString()}] [响应完成] 状态码: ${proxyRes.statusCode}, 长度: ${responseData.length}, 耗时: ${elapsedTime}ms`);
      
      // 记录响应预览（如果不是成功状态码）
      if (proxyRes.statusCode !== 200) {
        console.log(`[${new Date().toISOString()}] [错误响应] ${responseData.substring(0, 500)}...`);
      } else {
        console.log(`[${new Date().toISOString()}] [响应预览] ${responseData.substring(0, 200)}...`);
      }
      
      res.end(responseData);
      console.log(`[${new Date().toISOString()}] [请求结束] ${req.method} ${req.url}`);
      console.log('-'.repeat(80));
    });
  });
  
  // 处理请求错误
  proxyReq.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] [代理错误] ${error.message}`);
    console.error(error.stack);
    
    if (!res.headersSent) {
      res.writeHead(500, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  // 确保错误响应也有CORS头
      });
      res.end(JSON.stringify({
        error: '代理请求失败',
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      }));
    }
    
    console.log(`[${new Date().toISOString()}] [请求失败] ${req.method} ${req.url}`);
    console.log('-'.repeat(80));
  });
  
  // 设置超时（2分钟）
  proxyReq.setTimeout(120000, () => {
    console.error(`[${new Date().toISOString()}] [请求超时] 超过2分钟未响应`);
    proxyReq.destroy();
    
    if (!res.headersSent) {
      res.writeHead(504, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  // 确保超时响应也有CORS头
      });
      res.end(JSON.stringify({
        error: '网关超时',
        message: '请求超过2分钟未完成，请稍后再试',
        timestamp: new Date().toISOString()
      }));
    }
    
    console.log(`[${new Date().toISOString()}] [请求超时] ${req.method} ${req.url}`);
    console.log('-'.repeat(80));
  });
  
  // 发送请求体
  if (req.method !== 'GET' && req.method !== 'HEAD' && requestBody) {
    const bodyData = JSON.stringify(requestBody);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
  
  proxyReq.end();
});

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(80));
  console.log(`代理服务器已启动，监听端口: ${PORT}`);
  console.log(`代理路径: http://localhost:${PORT}/api/* -> https://openkey.cloud/v1/*`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`超时设置: 2分钟 (120000ms)`);
  console.log(`启动时间: ${new Date().toISOString()}`);
  console.log('='.repeat(80));
}); 