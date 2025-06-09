import { getPromptConfig, getCustomPrompt } from '../config/prompts';
import aiConfig from '../config/aiConfig';

// AI响应类型定义
export interface KeywordResponse {
  keyword: string;
  explanation: string;
}

// AI服务类
export class AIService {
  private apiUrl: string;
  private apiKey: string;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // 使用代理服务器URL
    this.apiUrl = this.isDevelopment ? 
      aiConfig.baseConfig.proxyUrl : 
      '/api/openai'; // Vercel Serverless Function 路径
      
    this.apiKey = aiConfig.baseConfig.apiKey;
    
    console.log('AI Service initialized');
    console.log('API Key available:', this.apiKey ? '是' : '否');
    console.log('API Proxy URL:', this.apiUrl);
    
    // 输出一条明显的日志，确认服务已初始化
    console.log('%c AI服务已初始化，准备通过代理发送请求 ', 'background: #222; color: #bada55; font-size: 16px;');
  }

  // 获取适当的提示词
  private getPrompt(type: 'keywordGenerator' | 'keywordExplainer'): string {
    // 首先尝试从本地存储获取自定义提示词
    const customPrompt = getCustomPrompt(type);
    if (customPrompt) {
      console.log(`使用自定义${type}提示词`);
      return customPrompt;
    }
    
    // 否则从配置中获取
    const { keywordGeneratorPrompt, keywordExplainerPrompt } = getPromptConfig();
    const prompt = type === 'keywordGenerator' ? keywordGeneratorPrompt : keywordExplainerPrompt;
    console.log(`使用默认${type}提示词, 长度:`, prompt.length);
    return prompt;
  }

  // 生成关键词
  async generateKeywords(query: string): Promise<KeywordResponse[]> {
    try {
      console.log('\n========== 开始生成关键词 ==========');
      console.log('查询内容:', query);
      console.log('使用的代理URL:', this.apiUrl);
      const prompt = this.getPrompt('keywordGenerator');
      console.log('提示词长度:', prompt.length);
      
      // 创建请求体 - 使用OpenAI API格式
      const requestBody = {
        model: aiConfig.models.default,
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: query
          },
          {
            role: 'system',
            content: 'Please respond in English only.'
          }
        ],
        temperature: 0.9,
        max_tokens: 1500,
      };
      
      console.log('请求体预览:', JSON.stringify(requestBody).substring(0, 200) + '...');
      
      // 设置超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 130000); // 客户端超时设置为130秒
      
      try {
        // 使用代理服务器发送请求
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        // 清除超时
        clearTimeout(timeoutId);

        // 记录响应状态
        console.log('收到响应时间:', new Date().toISOString());
        console.log('API响应状态:', response.status, response.statusText);
        
        // 获取响应文本
        const responseText = await response.text();
        console.log('响应内容长度:', responseText.length);
        console.log('响应内容预览:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
        
        if (!response.ok) {
          console.error('========== API响应错误 ==========');
          console.error('错误状态码:', response.status, response.statusText);
          console.error('错误响应内容:', responseText.substring(0, 500));
          console.error('========== API响应错误结束 ==========');
          throw new Error(`API响应错误: ${response.status} ${response.statusText} - ${responseText.substring(0, 100)}`);
        }

        // 尝试将文本解析为JSON
        let data;
        try {
          console.log('开始解析JSON响应...');
          data = JSON.parse(responseText);
          console.log('JSON解析成功');
        } catch (error) {
          console.error('========== JSON解析错误 ==========');
          console.error('解析错误:', error);
          console.error('无法解析的响应内容:', responseText.substring(0, 500));
          console.error('========== JSON解析错误结束 ==========');
          throw new Error('无法解析API响应为JSON格式');
        }

        // 使用OpenAI API响应格式
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          console.error('========== API响应格式错误 ==========');
          console.error('响应格式不正确:', JSON.stringify(data).substring(0, 500));
          console.error('========== API响应格式错误结束 ==========');
          throw new Error('API响应格式不正确，缺少必要字段');
        }

        const content = data.choices[0].message.content;
        console.log('API响应成功，内容长度:', content.length);
        console.log('内容预览:', content.substring(0, 200) + '...');
        
        // 解析AI返回的结果
        const results = this.parseKeywordResponse(content);
        console.log('解析结果:', JSON.stringify(results).substring(0, 200) + '...');
        console.log('生成的关键词数量:', results.length);
        console.log('========== 关键词生成完成 ==========\n');
        return results;
      } catch (fetchError: unknown) {
        // 清除超时
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('========== 请求超时 ==========');
          console.error('请求超过130秒未完成');
          console.error('========== 请求超时结束 ==========');
          throw new Error('请求超时，请稍后再试');
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('========== 生成关键词时出错 ==========');
      console.error('错误详情:', error);
      console.error('========== 错误结束 ==========\n');
      throw error; // 将错误向上抛出，让调用者处理
    }
  }

  // 解析关键词生成器的响应
  private parseKeywordResponse(content: string): KeywordResponse[] {
    try {
      console.log('开始解析关键词响应');
      
      // 首先检查是否是关键词解释器的响应（纯文本）
      if (content && !content.includes('"keyword"') && !content.includes('"explanation"')) {
        // 这可能是keywordExplainer的纯文本响应
        return [{
          keyword: this.keywordBeingExplained || "Search Command",
          explanation: content.trim()
        }];
      }
      
      // 以下是处理JSON格式响应的原有逻辑
      // 首先尝试直接解析JSON格式
      try {
        // 尝试直接解析整个内容为单个对象
        let processedContent = content;
        // 替换键名周围的单引号为双引号
        processedContent = processedContent.replace(/'([^']+)'(\s*:)/g, '"$1"$2');
        // 替换值周围的单引号为双引号
        processedContent = processedContent.replace(/:\s*'([^']*)'/g, ': "$1"');
        // 处理转义
        processedContent = processedContent.replace(/\\'/g, "'");
        
        try {
          const jsonData = JSON.parse(processedContent);
          // 如果是单个对象且包含keyword和explanation
          if (jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData) && jsonData.keyword && jsonData.explanation) {
            console.log('成功解析为单个JSON对象');
            return [jsonData]; // 返回包含单个对象的数组
          }
          
          // 如果是数组，检查第一个元素
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            console.log('解析为JSON数组，取第一个元素');
            return [jsonData[0]]; // 只取第一个元素
          }
        } catch (e) {
          console.log('整体JSON解析失败，尝试查找JSON对象');
        }

        // 查找内容中的JSON对象部分 {key: value}
        const jsonMatch = content.match(/\{\s*["']?keyword["']?\s*:\s*["']?.*?["']?\s*,\s*["']?explanation["']?\s*:\s*["']?.*?["']?\s*\}/);
        if (jsonMatch) {
          console.log('在内容中找到JSON对象格式字符串');
          let jsonStr = jsonMatch[0];
          
          // 处理单引号问题
          jsonStr = jsonStr.replace(/'([^']+)'(\s*:)/g, '"$1"$2');
          jsonStr = jsonStr.replace(/:\s*'([^']*)'/g, ': "$1"');
          jsonStr = jsonStr.replace(/\\'/g, "'");
          
          try {
            const jsonData = JSON.parse(jsonStr);
            if (jsonData && jsonData.keyword && jsonData.explanation) {
              console.log('成功解析为单个JSON对象');
              return [jsonData]; // 返回包含单个对象的数组
            }
          } catch (innerError) {
            console.error('JSON对象解析失败:', innerError);
          }
        }
      } catch (e) {
        console.log('JSON解析失败，尝试文本解析:', e);
      }

      // 尝试提取键值对
      try {
        const keywordMatch = content.match(/"keyword"\s*:\s*(['"])(.*?)\1/);
        const explanationMatch = content.match(/"explanation"\s*:\s*(['"])(.*?)\1/);
        
        if (keywordMatch && explanationMatch) {
          console.log('从键值对中提取数据');
          return [{
            keyword: keywordMatch[2],
            explanation: explanationMatch[2]
          }];
        }
      } catch (e) {
        console.log('键值对提取失败:', e);
      }

      // 按行分割响应
      const lines = content.split('\n').filter(line => line.trim() !== '');
      console.log(`分割为${lines.length}行`);
      
      // 尝试从文本中提取关键词和解释
      let keyword = '';
      let explanation = '';
      
      for (const line of lines) {
        // 尝试匹配"关键词：XXX"或"keyword: XXX"格式
        const keywordMatch = line.match(/^(关键词|keyword|关键字)[:：]\s*(.+)$/i);
        if (keywordMatch) {
          keyword = keywordMatch[2].trim();
          console.log('找到关键词:', keyword);
          continue;
        }
        
        // 尝试匹配"解释：XXX"或"explanation: XXX"格式
        const explanationMatch = line.match(/^(解释|explanation|描述|description)[:：]\s*(.+)$/i);
        if (explanationMatch) {
          explanation = explanationMatch[2].trim();
          console.log('找到解释');
          continue;
        }
      }
      
      // 如果成功提取了关键词和解释，返回结果
      if (keyword && explanation) {
        return [{
          keyword,
          explanation
        }];
      }
      
      // 如果没有成功提取，尝试使用整个内容作为关键词
      return [{
        keyword: this.keywordBeingExplained || (content.length > 100 ? content.substring(0, 100) + '...' : content),
        explanation: content
      }];
    } catch (error) {
      console.error('解析AI响应时出错:', error);
      return [{
        keyword: '解析错误',
        explanation: '无法解析AI响应，请重试或联系支持。'
      }];
    }
  }

  // 存储当前正在解释的关键词
  private keywordBeingExplained: string | null = null;

  // 解释关键词
  async explainKeyword(keyword: string): Promise<KeywordResponse[]> {
    try {
      // 存储当前正在解释的关键词，以便在解析响应时使用
      this.keywordBeingExplained = keyword;
      
      console.log('\n========== 开始解释关键词 ==========');
      console.log('关键词:', keyword);
      console.log('使用的代理URL:', this.apiUrl);
      const prompt = this.getPrompt('keywordExplainer');
      console.log('提示词长度:', prompt.length);
      
      // 创建请求体 - 使用OpenAI API格式
      const requestBody = {
        model: aiConfig.models.default,
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: keyword
          },
          {
            role: 'system',
            content: 'Please respond in English only.'
          }
        ],
        temperature: 0.9,
        max_tokens: 1500,
      };
      
      console.log('请求体预览:', JSON.stringify(requestBody).substring(0, 200) + '...');
      console.log('开始发送请求时间:', new Date().toISOString());
      
      // 设置超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 130000); // 客户端超时设置为130秒
      
      try {
        // 使用代理服务器发送请求
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        // 清除超时
        clearTimeout(timeoutId);

        // 记录响应状态
        console.log('收到响应时间:', new Date().toISOString());
        console.log('API响应状态:', response.status, response.statusText);
        
        // 获取响应文本
        const responseText = await response.text();
        console.log('响应内容长度:', responseText.length);
        console.log('响应内容预览:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
        
        if (!response.ok) {
          console.error('========== API响应错误 ==========');
          console.error('错误状态码:', response.status, response.statusText);
          console.error('错误响应内容:', responseText.substring(0, 500));
          console.error('========== API响应错误结束 ==========');
          throw new Error(`API响应错误: ${response.status} ${response.statusText} - ${responseText.substring(0, 100)}`);
        }

        // 尝试将文本解析为JSON
        let data;
        try {
          console.log('开始解析JSON响应...');
          data = JSON.parse(responseText);
          console.log('JSON解析成功');
        } catch (error) {
          console.error('========== JSON解析错误 ==========');
          console.error('解析错误:', error);
          console.error('无法解析的响应内容:', responseText.substring(0, 500));
          console.error('========== JSON解析错误结束 ==========');
          throw new Error('无法解析API响应为JSON格式');
        }

        // 使用OpenAI API响应格式
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          console.error('========== API响应格式错误 ==========');
          console.error('响应格式不正确:', JSON.stringify(data).substring(0, 500));
          console.error('========== API响应格式错误结束 ==========');
          throw new Error('API响应格式不正确，缺少必要字段');
        }

        const content = data.choices[0].message.content;
        console.log('API响应成功，内容长度:', content.length);
        console.log('内容预览:', content.substring(0, 200) + '...');
        
        // 解析AI返回的结果为KeywordResponse数组
        const results = this.parseKeywordResponse(content);
        console.log('解析结果:', JSON.stringify(results).substring(0, 200) + '...');
        console.log('解析得到的结果数量:', results.length);
        console.log('========== 关键词解释完成 ==========\n');
        return results;
      } catch (fetchError: unknown) {
        // 清除超时
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('========== 请求超时 ==========');
          console.error('请求超过130秒未完成');
          console.error('========== 请求超时结束 ==========');
          throw new Error('请求超时，请稍后再试');
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('========== 解释关键词时出错 ==========');
      console.error('错误详情:', error);
      console.error('========== 错误结束 ==========\n');
      throw error; // 将错误向上抛出，让调用者处理
    }
  }
}

// 导出单例实例
export const aiService = new AIService();