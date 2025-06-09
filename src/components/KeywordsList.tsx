import React, { useState } from 'react';
import { KeywordResponse } from '../services/aiService';

// 复制到剪贴板的函数
const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Copy failed:', err);
    });
};

// 构建Google搜索URL
const buildGoogleSearchUrl = (keyword: string): string => {
  return `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
};

interface KeywordsListProps {
  keywords: KeywordResponse[];
  isLoading: boolean;
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords, isLoading }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 处理复制按钮点击
  const handleCopy = (text: string, index: number) => {
    copyToClipboard(text).then(() => {
      setCopiedIndex(index);
      // 2秒后重置复制状态
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">Generating keywords...</span>
        </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-2 border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5 border-2 border-gray-300">
                  Search Command
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2 border-2 border-gray-300">
                  Command Analysis
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10 border-2 border-gray-300">
                  Search
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keywords.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-left border-2 border-gray-300">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded">{item.keyword}</code>
                        <button
                          onClick={() => handleCopy(item.keyword, index)}
                          className="ml-2 inline-flex items-center p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md transition"
                          title="Copy to clipboard"
                          aria-label="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>
                              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left border-2 border-gray-300">
                    <div className="text-sm text-gray-500 text-left">{item.explanation}</div>
                  </td>
                  <td className="px-6 py-4 text-center border-2 border-gray-300">
                    <a 
                      href={buildGoogleSearchUrl(item.keyword)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                      title="Search with Google"
                      aria-label="Search with Google"
                    >
                      <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 488">
                        <path fill="#4285F4" d="M343.74 288h-30v-49.9h87.6c1.69 9.37 2.66 19.07 2.66 29.9 0 47.86-17.3 89.9-48.26 119.44C324.89 417.3 288.7 432 248 432c-66.28 0-123.61-38.16-151.21-93.5-8.42-16.9-13.49-35.5-14.79-55.5v-32c1.3-20 6.37-38.6 14.79-55.5C124.39 140.16 181.72 102 248 102c66.28 0 123.61 38.16 151.21 93.5 5.17 10.36 9.03 21.42 11.79 32.97h-67.26V288z" />
                        <path fill="#34A853" d="M248 386c38.59 0 71.74-13.59 96.8-41.87 20.09-22.3 32.6-53.13 33.2-90.13H248V386z" />
                        <path fill="#FBBC05" d="M248 148c-38.59 0-71.74 13.59-96.8 41.87-20.09 22.3-32.6 53.13-33.2 90.13H248V148z" />
                        <path fill="#EA4335" d="M97 254h151v-46H97v46z" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordsList; 