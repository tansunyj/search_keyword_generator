import React, { useState, useRef } from 'react';
import { aiService, KeywordResponse } from '../services/aiService';
import SEOHead from '../components/layout/SEOHead';

// 删除旧的模拟函数
// const explainKeywords = async (keywords: string): Promise<string> => { ... };

const ExplainPage: React.FC = () => {
  const [keywordsInput, setKeywordsInput] = useState('');
  const [explanations, setExplanations] = useState<KeywordResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 提取意图部分的函数
  const extractIntent = (explanation: string): string => {
    try {
      // 查找 "- **Intent**:" 和 "- **Suggestions**:" 之间的内容
      const intentStart = explanation.indexOf("- **Intent**:");
      const suggestionsStart = explanation.indexOf("- **Suggestions**:");
      
      if (intentStart !== -1 && suggestionsStart !== -1 && intentStart < suggestionsStart) {
        // 提取 "- **Intent**:" 后面和 "- **Suggestions**:" 前面的内容
        const intentContent = explanation.substring(
          intentStart + "- **Intent**:".length, 
          suggestionsStart
        ).trim();
        
        return intentContent;
      }
      
      // 如果没有找到标记，返回原始解释
      return explanation;
    } catch (err) {
      console.error('Error extracting intent:', err);
      return explanation;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywordsInput(e.target.value);
  };

  const handleClearInput = () => {
    setKeywordsInput('');
    // Focus on input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setKeywordsInput(text);
      // Focus on input
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Cannot access clipboard:', err);
      setError('Cannot access clipboard, please check browser permissions');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywordsInput.trim()) {
      setError('Please enter keywords to explain');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setExplanations(null); // Clear previous explanations
      
      const result = await aiService.explainKeyword(keywordsInput);
      // 确保显示用户输入的关键词
      if (result && result.length > 0) {
        // 覆盖返回的keyword，使用用户输入的关键词
        result[0].keyword = keywordsInput;
        
        // 处理解释内容，提取意图部分
        if (result[0].explanation) {
          result[0].explanation = extractIntent(result[0].explanation);
        }
      }
      setExplanations(result);
    } catch (err) {
      // Extract more specific error messages
      let errorMessage = 'Error explaining keywords';
      
      if (err instanceof Error) {
        // Check if error contains API error information
        if (err.message.includes('API response error')) {
          errorMessage = `API service temporarily unavailable, please try again later (${err.message})`;
        } else if (err.message.includes('Cannot parse API response')) {
          errorMessage = 'Server returned invalid data format, please try again later';
        } else {
          errorMessage = `Failed to explain keywords: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      console.error('Error explaining keywords:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Search Engine Optimization Analysis Tool | SEO Keyword Analysis"
        description="Analyze search engine optimization (SEO) concepts and techniques, including keyword strategies and long-tail keyword examples to help you understand and implement effective SEO strategies."
        canonicalUrl="https://seokeywords.com/explain"
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Search Engine Optimization and Keyword Analysis
            </h1>
            
            <div className="flex justify-center">
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl md:max-w-full mx-auto leading-relaxed">
                Enter keywords or SEO terms to get professional search engine optimization analysis and long-tail keyword examples to help optimize your website content.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm border border-blue-100">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="mb-6">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Keywords
                </label>
                <div className="relative">
                  <textarea
                    id="keywords"
                    ref={textareaRef}
                    value={keywordsInput}
                    onChange={handleInputChange}
                    placeholder="Enter SEO keywords or terms, such as: search engine optimization, long tail keyword examples, keyword generation strategies, etc..."
                    className="w-full px-6 py-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
                    rows={4}
                    aria-label="Keyword input"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {/* Clear button */}
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Clear input"
                      aria-label="Clear input"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    {/* Paste button */}
                    <button
                      type="button"
                      onClick={handlePasteInput}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Paste content"
                      aria-label="Paste content"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Paste the SEO keywords you want to understand in depth</p>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Explaining...
                    </span>
                  ) : 'Get Explanation'}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </form>
          </div>
          
          {explanations && explanations.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
                Keyword Explanation
              </h2>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Search Command
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">
                        Command Analysis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {explanations.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 break-words text-left">
                          {item.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 break-words text-left">
                          {item.explanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Feature Description */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How to Use the Keyword Explanation Feature
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-600 font-bold text-xl mb-4 flex items-center justify-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                  <span>Copy Keywords</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-left">
                  Copy the advanced SEO keywords or keyword combinations you want to understand from any source.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-600 font-bold text-xl mb-4 flex items-center justify-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                  <span>Paste and Submit</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-left">
                  Paste the keywords into the input box, then click the "Get Explanation" button.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-600 font-bold text-xl mb-4 flex items-center justify-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                  <span>Review Explanations</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-left">
                  Review the detailed explanations of your keywords to better understand their meaning and search intent.
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="mt-16 bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-blue-100 pb-3 text-center">
              Why Understanding Keywords Matters
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-left">
              Understanding the true meaning and search intent behind keywords is crucial for obtaining precise search results. By analyzing keywords in depth, you can:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-3 mb-6 text-left">
              <li className="leading-relaxed">More accurately understand user search needs</li>
              <li className="leading-relaxed">Create more targeted content</li>
              <li className="leading-relaxed">Improve search precision</li>
              <li className="leading-relaxed">Optimize your search strategy</li>
              <li className="leading-relaxed">Stand out in competitive markets</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-left">
              Our keyword explanation tool uses advanced semantic analysis technology to help you deeply understand the search intent behind each keyword.
            </p>
          </div>

            {/* 添加SEO教育内容 */}
            {!isLoading && (
              <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
                        Generating Effective Search Terms
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed text-left">
                        Effective generation of search terms is the foundation of any successful SEO strategy. By understanding user search intent and keyword research, you can discover more valuable traffic opportunities.
                      </p>
                      <p className="text-gray-600 mb-4 leading-relaxed text-left">
                        Steps for generating search terms include:
                      </p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-3 text-left">
                        <li className="leading-relaxed">Identify core topics and keywords</li>
                        <li className="leading-relaxed">Expand to related terms and synonyms</li>
                        <li className="leading-relaxed">Research user search intent</li>
                        <li className="leading-relaxed">Analyze competitor keyword strategies</li>
                        <li className="leading-relaxed">Use professional tools to expand your keyword library</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-blue-100 pb-3 text-center">
                        Long-Tail Keyword Examples
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed text-left">
                        Long-tail keywords are multi-word combinations that precisely match user search intent. Here are examples from different industries:
                      </p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-3 text-left">
                        <li className="leading-relaxed"><strong>E-commerce</strong>: Men's anti-slip running shoes price-performance ranking</li>
                        <li className="leading-relaxed"><strong>Education</strong>: How to improve English speaking skills in 3 months for beginners</li>
                        <li className="leading-relaxed"><strong>Tech Products</strong>: Best lightweight business laptops with long battery life 2023</li>
                        <li className="leading-relaxed"><strong>Health & Fitness</strong>: Sustainable weight loss methods for women over 30</li>
                        <li className="leading-relaxed"><strong>Travel</strong>: Best 7-day 6-night Bali self-guided tour itinerary</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}
        </div>
      </div>
    </>
  );
};

export default ExplainPage; 