import React, { useState, useRef } from 'react';
import SEOHead from '../components/layout/SEOHead';
import { aiService, KeywordResponse } from '../services/aiService';
import KeywordsList from '../components/KeywordsList';

// 工具函数：提取关键词和解释
const extractKeywordAndExplanation = (text: string): KeywordResponse => {
  try {
    // 找到keyword的位置
    const keywordStart = text.indexOf('"keyword":') + 10; // +10 跳过 '"keyword": "'
    const keywordEnd = text.indexOf('", "explanation"');
    let keyword = text.substring(keywordStart, keywordEnd);
    
    // 找到explanation的位置
    const explanationStart = text.indexOf('"explanation":') + 14; // +14 跳过 '"explanation": "'
    const explanationEnd = text.lastIndexOf('"}');
    let explanation = text.substring(explanationStart, explanationEnd);
    
    // 清理多余的转义字符和引号
    keyword = keyword.replace(/\\"/g, '"').replace(/^"|"$/g, '');
    explanation = explanation.replace(/\\"/g, '"').replace(/^"|"$/g, '');
    
    return {
      keyword,
      explanation
    };
  } catch (err) {
    console.error('Error extracting keyword and explanation:', err);
    return {
      keyword: '',
      explanation: 'Failed to parse response'
    };
  }
};

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [keywords, setKeywords] = useState<KeywordResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResults, setHasResults] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearInput = () => {
    setSearchQuery('');
    // Focus on input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchQuery(text);
      // Focus on input
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Cannot access clipboard:', err);
      // Add a friendly error message
      setError('Cannot access clipboard, please check browser permissions');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search intent');
      return;
    }
    
    try {
      setKeywords([]);
      setHasResults(false);
      setIsLoading(true);
      setError(null);
      
      const result = await aiService.generateKeywords(searchQuery);
      
      if (result) {
        // 检查result是否为字符串
        if (typeof result === 'string') {
          const parsedResult = extractKeywordAndExplanation(result);
          if (parsedResult.keyword) {
            setKeywords([parsedResult]);
            setHasResults(true);
          } else {
            setError('Could not extract keywords from response');
          }
        } else if (Array.isArray(result)) {
          // 如果result是数组，直接使用
          setKeywords(result);
          setHasResults(true);
        } else {
          setError('Invalid response format from server');
        }
      } else {
        setError('Could not generate keywords, please try a different search intent');
      }
    } catch (err) {
      // Extract more specific error messages
      let errorMessage = 'Error generating keywords';
      
      if (err instanceof Error) {
        // Check if error contains API error information
        if (err.message.includes('API response error')) {
          errorMessage = `API service temporarily unavailable, please try again later (${err.message})`;
        } else if (err.message.includes('Cannot parse API response')) {
          errorMessage = 'Server returned invalid data format, please try again later';
        } else {
          errorMessage = `Failed to generate keywords: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      console.error('Error generating keywords:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string, engine: 'google' | 'bing') => {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = engine === 'google' 
      ? `https://www.google.com/search?q=${encodedKeyword}`
      : `https://www.bing.com/search?q=${encodedKeyword}`;
    
    window.open(url, '_blank');
  };

  return (
    <>
      <SEOHead
        title="高级搜索关键词生成器 | 搜索命令优化工具"
        description="使用AI技术生成高效搜索关键词，支持filetype、site、intext、intitle等高级搜索命令，帮助您精确查找PDF、文档、图片和视频等各类资源。"
        keywords="filetype:pdf,site:edu,intitle:search,intext:keywords,filetype:mp4,filetype:mp3,allintext,allintitle,inurl,高级搜索,搜索命令,搜索技巧,Google搜索,搜索优化"
        canonicalUrl="https://seokeywords.com"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                AI Smart Search Keywords Generator
              </h1>
              <div className="flex justify-center">
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl md:max-w-full mx-auto leading-relaxed">
                  Enter your search intent to get precise advanced search keywords with detailed explanations, helping you accurately express your search needs.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm border border-blue-100">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <label htmlFor="search-intent" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Search Intent
                  </label>
                  <div className="relative">
                    <textarea
                      id="search-intent"
                      ref={textareaRef}
                      value={searchQuery}
                      onChange={handleInputChange}
                      placeholder="Enter your search intent or keyword topic (e.g., digital marketing, website design, content creation, etc.)..."
                      className="w-full px-6 py-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
                      rows={4}
                      aria-label="Search intent"
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
                  <p className="mt-2 text-sm text-gray-500">Detailed descriptions help us generate more accurate keywords</p>
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
                        Generating...
                      </span>
                    ) : 'Generate Keywords'}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Results Section - Only shown when there are results and not loading */}
        {hasResults && !isLoading && keywords.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center border-b border-gray-100 pb-3">
                  Generated Advanced SEO Keywords
                </h2>
                
                <KeywordsList keywords={keywords} isLoading={isLoading} />
              </div>
            </div>
          </section>
        )}

        {/* Introduction Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
                  What are Advanced SEO Keywords?
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed text-left">
                Advanced SEO keywords are phrases that precisely express user search intent, helping users find the information they need more accurately. These keywords include not only basic search terms but also context and semantics of the user's actual search intent.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed text-left">
                  Compared to ordinary keywords, advanced SEO keywords typically have the following characteristics:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-3 text-left">
                  <li className="leading-relaxed">More precisely match user intent</li>
                  <li className="leading-relaxed">Include more specific search need descriptions</li>
                  <li className="leading-relaxed">Better structure, clearer expression</li>
                  <li className="leading-relaxed">Include long-tail keywords, covering more search scenarios</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-blue-100 pb-3 text-center">
                  How to Use This Tool?
                </h2>
                <ol className="list-decimal pl-5 text-gray-600 space-y-4 text-left">
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">Enter Search Intent</strong>
                    <p>Enter the topic or keyword you want to optimize in the search box.</p>
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">Generate Keywords</strong>
                    <p>Click the "Generate Keywords" button, and the system will analyze your input and generate an optimized list of SEO keywords.</p>
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-gray-900">View and Use Results</strong>
                    <p>Browse the generated keywords and their explanations, click the search icon to directly search these keywords in Google or Bing.</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;