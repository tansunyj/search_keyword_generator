/**
 * OpenAI 服务 - 使用 Vercel AI SDK
 * 
 * 这是一个示例代码，展示如何使用 Vercel AI SDK 调用 OpenAI API
 * 实际项目中使用了 aiService.ts 作为主要实现
 */

import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import aiConfig from '../config/aiConfig';

// 判断当前是否为开发环境
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 获取配置的OpenAI模型
 * @param {string} modelName - 模型名称，如果未指定使用默认模型
 * @returns 配置好的openai模型函数
 */
const getModel = (modelName?: string) => {
  // 使用配置文件中的API密钥
  const modelConfig = {
    apiKey: aiConfig.baseConfig.apiKey,
    // 只在开发环境中使用代理
    baseURL: isDevelopment && aiConfig.baseConfig.useProxy ? aiConfig.baseConfig.proxyUrl : undefined
  };
  
  return openai(modelName || aiConfig.models.default, modelConfig);
};

/**
 * 生成文本响应
 * @param options - 选项参数
 * @returns 返回生成的文本
 */
export const generateAIText = async (options: {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, any>;
}) => {
  const {
    prompt,
    model,
    temperature = 0.7,
    maxTokens = 1000,
    metadata = {}
  } = options;
  
  try {
    const { text } = await generateText({
      model: getModel(model),
      prompt: prompt,
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 0.9
    });
    
    return { text, metadata };
  } catch (error) {
    console.error(`AI文本生成错误:`, error);
    throw error;
  }
};

/**
 * 生成JSON结构化数据
 * @param options - 选项参数
 * @returns 返回生成的JSON数据
 */
export const generateAIObject = async <T>(options: {
  prompt: string;
  schema: Record<string, any>;
  model?: string;
  temperature?: number;
  metadata?: Record<string, any>;
}) => {
  const {
    prompt,
    schema,
    model,
    temperature = 0.7,
    metadata = {}
  } = options;
  
  if (!schema) {
    throw new Error('生成JSON结构化数据需要提供schema参数');
  }
  
  try {
    // 使用 Vercel AI SDK 生成结构化数据
    const { object } = await generateObject<T>({
      model: getModel(model),
      prompt: prompt,
      temperature: temperature,
      schema: schema as any
    });
    
    return { object, metadata };
  } catch (error) {
    console.error('AI结构化数据生成错误:', error);
    throw error;
  }
};

/**
 * 使用示例：
 * 
 * // 生成文本
 * const { text } = await generateAIText({
 *   prompt: "Tell me a joke about programming"
 * });
 * 
 * // 生成结构化数据
 * interface JokeResponse {
 *   setup: string;
 *   punchline: string;
 *   category: string;
 * }
 * 
 * const jokeSchema = {
 *   type: "object",
 *   properties: {
 *     setup: { type: "string" },
 *     punchline: { type: "string" },
 *     category: { type: "string" }
 *   },
 *   required: ["setup", "punchline", "category"]
 * };
 * 
 * const { object } = await generateAIObject<JokeResponse>({
 *   prompt: "Generate a programming joke",
 *   schema: jokeSchema
 * });
 * 
 * console.log(object.setup);
 * console.log(object.punchline);
 */

export default {
  generateAIText,
  generateAIObject
}; 