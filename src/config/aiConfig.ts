/**
 * AI 服务配置文件
 * 用于配置 AI 服务相关参数
 */

import { getEnvVar } from './env';

// 开发环境判断
const isDevelopment = process.env.NODE_ENV === 'development';

// AI 基础配置
const baseConfig = {
  // API 密钥，从环境变量中获取
  apiKey: getEnvVar('REACT_APP_AI_API_KEY', ''),
  
  // API 基础 URL
  apiUrl: 'https://openkey.cloud/v1/chat/completions',
  
  // 代理 URL，在生产环境下为 Vercel Serverless 函数
  proxyUrl: isDevelopment ? 'http://localhost:3001/api/openai' : '/api/openai',
  
  // 是否使用代理
  useProxy: true,
  
  // 请求超时时间（毫秒）
  timeout: 120000
};

// 支持的模型配置
const models = {
  // 默认模型
  default: 'grok-3-mini-beta',
  
  // 其他模型配置
  grok: 'grok-3-mini-beta',
  chatgpt: 'gpt-3.5-turbo'
};

// 导出配置
const aiConfig = {
  baseConfig,
  models
};

export default aiConfig; 