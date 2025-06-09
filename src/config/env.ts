// 环境变量配置

// API配置默认值 - 仅用于开发环境
const DEFAULT_AI_API_URL = 'https://openkey.cloud/v1/chat/completions';
// 不要在代码中硬编码 API 密钥，生产环境应该从环境变量中获取

// 获取环境变量，如果不存在则使用默认值
export function getEnvVar(name: string, defaultValue: string = ''): string {
  // 如果在浏览器环境中
  if (typeof window !== 'undefined') {
    // 检查是否有 Vercel 运行时环境变量
    // @ts-ignore
    if (window && window.__NEXT_DATA__ && window.__NEXT_DATA__.runtimeConfig && window.__NEXT_DATA__.runtimeConfig[name]) {
      // @ts-ignore
      return window.__NEXT_DATA__.runtimeConfig[name];
    }
  }
  
  // 优先从process.env中获取（React应用中的环境变量）
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string;
  }
  
  // 如果是API相关的环境变量，使用开发环境默认值
  if (name === 'REACT_APP_AI_API_URL') {
    return DEFAULT_AI_API_URL;
  }
  
  // 其他情况返回传入的默认值
  return defaultValue;
} 