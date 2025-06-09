import React from 'react';
import SEOHead from '../components/layout/SEOHead';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEOHead 
        title="关于我们 | 高级搜索关键词生成与解析工具" 
        description="了解我们的AI驱动搜索工具如何帮助您掌握filetype:pdf、site:edu等高级搜索命令，提高信息检索效率，精确找到所需文档、视频和学术资源。" 
        keywords="filetype:pdf,filetype:mp3,filetype:mp4,site:edu,site:gov,intitle,intext,allintitle,allintext,inurl,高级搜索工具,搜索命令生成器,Google搜索优化"
        canonicalUrl="https://seokeywords.com/about"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          About Us
        </h1>
        
        {/* Project Introduction */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            What is AI Smart Search Keywords Generator?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed text-left">
            AI Smart Search Keywords Generator is a professional tool designed to help users accurately express their search needs. Our tool utilizes advanced AI technology to deeply analyze the search intent input by users and generate precise high-level search keywords, making searching more efficient.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed text-left">
            Unlike traditional search methods, our generator not only provides keyword suggestions but also offers detailed explanations for each keyword, helping users understand the meaning and search intent behind the keywords. Additionally, we provide direct search functionality, allowing users to immediately use these keywords to search in mainstream search engines.
          </p>
          <p className="text-gray-700 leading-relaxed text-left">
            Whether you are a regular internet user, student, researcher, or professional, our tool can help you express your search needs more precisely and obtain more accurate search results.
          </p>
        </section>
        
        {/* Core Features */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3 text-left">Keyword Generation</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Based on your input search intent, generate precise high-level search keyword lists, each with detailed explanations to help you express your search needs more accurately.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3 text-left">Keyword Explanation</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Analyze and explain the meaning and search intent of any high-level search keywords in plain language, helping you better understand and use these keywords.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3 text-left">Example Library</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Provide a rich collection of high-level search keyword examples, categorized by different fields and categories, to help you learn how to express search needs more precisely.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3 text-left">Language Support</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Support keyword generation and explanation in multiple languages to meet the search needs of users in different language environments.
              </p>
            </div>
          </div>
        </section>
        
        {/* Use Cases */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            Use Cases
          </h2>
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 text-left">Everyday Search Users</h3>
                <p className="text-gray-700 leading-relaxed text-left">Get more precise search keywords, improve search efficiency, and find the information you need faster.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 text-left">Students and Researchers</h3>
                <p className="text-gray-700 leading-relaxed text-left">Quickly find academic resources and research materials through precise keywords, improving learning and research efficiency.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 text-left">Content Creators</h3>
                <p className="text-gray-700 leading-relaxed text-left">Understand search keywords for specific topics, learn about users' specific search needs and focus points on that topic.</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 text-left">Professionals</h3>
                <p className="text-gray-700 leading-relaxed text-left">Use precise professional terminology keywords to efficiently obtain industry information and improve work efficiency.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Technology */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 text-center">
            Our Technology
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-left">
            Our AI Smart Search Keywords Generator is based on the latest AI and natural language processing technologies, capable of deeply understanding user search intent and generating precise, efficient search keywords.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Semantic Analysis</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Deeply analyze the semantic meaning and contextual relationships of keywords to ensure that the generated keywords accurately match the user's true search intent.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Intent Recognition</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Identify the user intent behind search terms (information query, problem solving, etc.) and generate precise keywords for different intents.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Multilingual Support</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Advanced multilingual processing capabilities support cross-language keyword generation and explanation, meeting the search needs of global users.
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-left">
            We continuously optimize and update our algorithms to ensure that the generated keywords accurately reflect user search intent and provide a more precise and effective search experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage; 