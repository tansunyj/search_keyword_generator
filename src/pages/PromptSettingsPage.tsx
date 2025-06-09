import React, { useState, useEffect } from 'react';
import { getCustomPrompt, setCustomPrompt, resetPrompt } from '../config/prompts';
import { DEFAULT_PROMPTS } from '../config/prompts';
import SEOHead from '../components/layout/SEOHead';

const PromptSettingsPage: React.FC = () => {
  const [keywordGeneratorPrompt, setKeywordGeneratorPrompt] = useState('');
  const [keywordExplainerPrompt, setKeywordExplainerPrompt] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 加载保存的提示词
  useEffect(() => {
    const savedGeneratorPrompt = getCustomPrompt('keywordGenerator');
    const savedExplainerPrompt = getCustomPrompt('keywordExplainer');
    
    if (savedGeneratorPrompt) {
      setKeywordGeneratorPrompt(savedGeneratorPrompt);
    } else {
      setKeywordGeneratorPrompt(DEFAULT_PROMPTS.keywordGenerator);
    }
    
    if (savedExplainerPrompt) {
      setKeywordExplainerPrompt(savedExplainerPrompt);
    } else {
      setKeywordExplainerPrompt(DEFAULT_PROMPTS.keywordExplainer);
    }
  }, []);

  // 保存提示词
  const handleSaveGeneratorPrompt = () => {
    try {
      setCustomPrompt('keywordGenerator', keywordGeneratorPrompt);
      setSuccessMessage('关键词生成器提示词已保存');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage('保存提示词时出错');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // 保存解释器提示词
  const handleSaveExplainerPrompt = () => {
    try {
      setCustomPrompt('keywordExplainer', keywordExplainerPrompt);
      setSuccessMessage('关键词解释器提示词已保存');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage('保存提示词时出错');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // 重置生成器提示词
  const handleResetGeneratorPrompt = () => {
    resetPrompt('keywordGenerator');
    setKeywordGeneratorPrompt(DEFAULT_PROMPTS.keywordGenerator);
    setSuccessMessage('关键词生成器提示词已重置为默认值');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // 重置解释器提示词
  const handleResetExplainerPrompt = () => {
    resetPrompt('keywordExplainer');
    setKeywordExplainerPrompt(DEFAULT_PROMPTS.keywordExplainer);
    setSuccessMessage('关键词解释器提示词已重置为默认值');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEOHead 
        title="提示词设置 | 自定义搜索命令生成规则" 
        description="自定义AI提示词设置，优化filetype、site、intext等高级搜索命令的生成和解析，提高搜索关键词的精确度和实用性。" 
        keywords="filetype:pdf,site:edu,intitle,intext,搜索命令生成,AI提示词,搜索优化,高级搜索技巧,Google搜索语法"
        canonicalUrl="https://seokeywords.com/settings"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          提示词设置
        </h1>
        
        <p className="text-base sm:text-lg text-gray-600 max-w-5xl mx-auto mb-12 leading-relaxed text-center">
          在这里您可以自定义AI提示词，以优化关键词生成和解释的结果。
        </p>

        {/* 提示消息 */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* 关键词生成器提示词 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            关键词生成器提示词
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4 text-left">
              此提示词用于指导AI如何生成高级SEO关键词。您可以根据需要进行修改，但请确保保留JSON格式的返回要求。
            </p>
            
            <textarea
              value={keywordGeneratorPrompt}
              onChange={(e) => setKeywordGeneratorPrompt(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-80 font-mono text-sm"
              placeholder="输入关键词生成器提示词..."
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleResetGeneratorPrompt}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              重置为默认值
            </button>
            <button
              onClick={handleSaveGeneratorPrompt}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              保存提示词
            </button>
          </div>
        </div>

        {/* 关键词解释器提示词 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            关键词解释器提示词
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4 text-left">
              此提示词用于指导AI如何解释和分析SEO关键词。您可以根据需要进行修改，以获得更符合您需求的解释。
            </p>
            
            <textarea
              value={keywordExplainerPrompt}
              onChange={(e) => setKeywordExplainerPrompt(e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-80 font-mono text-sm"
              placeholder="输入关键词解释器提示词..."
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleResetExplainerPrompt}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              重置为默认值
            </button>
            <button
              onClick={handleSaveExplainerPrompt}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              保存提示词
            </button>
          </div>
        </div>
        
        {/* 使用说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-blue-100 pb-3 text-center">
            提示词使用说明
          </h2>
          
          <div className="text-gray-700 space-y-4 text-left">
            <p>
              <strong>关键词生成器提示词</strong>应包含以下要素：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>明确指示AI生成高级SEO关键词</li>
              <li>指定关键词的数量和结构</li>
              <li>要求为每个关键词提供解释</li>
              <li>指定返回格式（JSON格式）</li>
            </ul>
            
            <p className="mt-4">
              <strong>关键词解释器提示词</strong>应包含以下要素：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>指导AI如何分析关键词</li>
              <li>要求分析关键词的搜索意图</li>
              <li>要求评估关键词的竞争度和商业价值</li>
              <li>要求提供相关的长尾关键词建议</li>
            </ul>
            
            <p className="mt-4">
              修改提示词后，系统将立即使用新的提示词进行关键词生成和解释。如果您遇到问题，可以随时重置为默认提示词。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSettingsPage; 