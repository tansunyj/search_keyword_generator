/**
 * OpenAI API 代理 Serverless 函数
 * 该函数用于转发前端请求到 OpenAI API，避免在前端暴露 API 密钥
 */

// 获取环境变量中的 API 密钥 - 直接使用环境变量
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_AI_API_KEY;
// OpenAI API 端点
const OPENAI_API_URL = process.env.REACT_APP_AI_API_URL || 'https://openkey.cloud/v1/chat/completions';

export default async function handler(req, res) {
  // 设置CORS头，允许跨域请求
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 仅接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  try {
    // 解析请求体
    const requestBody = req.body;
    
    // 记录请求信息（仅在开发环境中）
    if (process.env.NODE_ENV === 'development') {
      console.log('收到的请求:', JSON.stringify(requestBody).substring(0, 200) + '...');
    }

    // 检查API密钥是否存在
    if (!OPENAI_API_KEY) {
      console.error('错误: 缺少 API 密钥');
      // 记录所有可用的环境变量名称（不记录值，仅名称）
      const envVarNames = Object.keys(process.env).join(', ');
      console.error('可用环境变量名称:', envVarNames);
      
      return res.status(500).json({
        error: '服务器配置错误',
        message: '缺少 API 密钥，请联系管理员配置环境变量',
        availableEnvVars: process.env.NODE_ENV === 'development' ? envVarNames : undefined
      });
    }

    // 构建请求选项
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 确保 Bearer 和 token 之间有空格
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'User-Agent': 'Vercel Serverless Function'
      },
      body: JSON.stringify(requestBody),
      // 设置超时时间 - AbortController
      signal: AbortSignal.timeout(110000), // 110秒超时，略小于客户端的120秒
    };

    // 记录将要发送的请求（仅在开发环境中，不包含 API 密钥）
    if (process.env.NODE_ENV === 'development') {
      const redactedOptions = {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          'Authorization': 'Bearer [REDACTED]'
        }
      };
      console.log('发送请求到:', OPENAI_API_URL);
      console.log('请求选项:', JSON.stringify(redactedOptions, null, 2));
    } else {
      console.log(`正在发送请求到 ${OPENAI_API_URL}`);
    }

    // 发送请求到 OpenAI API
    const response = await fetch(OPENAI_API_URL, fetchOptions);
    
    // 获取响应数据
    const responseText = await response.text();
    let data;
    
    try {
      // 尝试解析JSON响应
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('解析响应失败:', parseError);
      console.error('原始响应:', responseText.substring(0, 500));
      return res.status(500).json({
        error: '无法解析API响应',
        message: '服务器返回了无效的JSON数据'
      });
    }
    
    // 检查响应状态
    if (!response.ok) {
      console.error('OpenAI API 返回错误:', data);
      return res.status(response.status).json({ 
        error: 'OpenAI API 请求失败', 
        details: data,
        status: response.status,
        statusText: response.statusText
      });
    }
    
    // 记录成功响应（仅在开发环境中）
    if (process.env.NODE_ENV === 'development') {
      console.log('API响应成功，响应状态:', response.status);
      console.log('响应数据预览:', JSON.stringify(data).substring(0, 200) + '...');
    }
    
    // 返回成功响应
    return res.status(200).json(data);
  } catch (error) {
    console.error('处理请求时出错:', error);
    return res.status(500).json({ 
      error: '服务器内部错误', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 