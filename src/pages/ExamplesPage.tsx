import React, { useState, useRef } from 'react';
import SEOHead from '../components/layout/SEOHead';

// Google search operators data
const googleOperators = [
  {
    category: 'filetype:',
    description: 'Limit search results to specific file types',
    keywords: [
      {
        keyword: 'filetype:pdf',
        explanation: 'Search for PDF files, commonly used for finding documents, reports, or e-books.'
      },
      {
        keyword: 'filetype:mp4',
        explanation: 'Search for MP4 video files, suitable for finding or downloading video content.'
      },
      {
        keyword: 'filetype:mp3',
        explanation: 'Search for MP3 audio files, commonly used for finding music or podcast downloads.'
      },
      {
        keyword: 'filetype:doc or filetype:docx',
        explanation: 'Search for Microsoft Word documents, suitable for finding templates or editable files.'
      },
      {
        keyword: 'filetype:pdf air jordan',
        explanation: 'Search for PDF files related to Air Jordan, possibly directory or guide.'
      },
      {
        keyword: 'filetype:pdf calligraphy',
        explanation: 'Search for PDF tutorials or guides related to calligraphy, suitable for art enthusiasts.'
      },
      {
        keyword: 'filetype:pdf container house',
        explanation: 'Search for PDF designs or plans for container houses, suitable for architecture or construction.'
      },
      {
        keyword: 'filetype:ppt',
        explanation: 'Search for PowerPoint files, commonly used for finding presentations or templates.'
      }
    ]
  },
  {
    category: 'site:',
    description: 'Limit search results to specific websites or domains',
    keywords: [
      {
        keyword: 'site:edu',
        explanation: 'Search content on educational institution websites, suitable for academic research.'
      },
      {
        keyword: 'site:gov',
        explanation: 'Search content on government websites, suitable for finding official information or policies.'
      },
      {
        keyword: 'site:wikipedia.org',
        explanation: 'Search only on the Wikipedia website, suitable for finding encyclopedia knowledge.'
      },
      {
        keyword: 'site:youtube.com cooking',
        explanation: 'Search for cooking-related videos on YouTube, combining website restriction and theme.'
      },
      {
        keyword: 'site:reddit.com programming',
        explanation: 'Search for programming-related discussions on Reddit, suitable for finding community opinions.'
      },
      {
        keyword: 'invisalign doctor site',
        explanation: 'Search for Invisalign-related content or providers, possibly official Invisalign website. Navigation and transaction intent used for dental services.'
      },
      {
        keyword: 'site plan',
        explanation: 'Search for content related to site planning (e.g., architecture or urban planning), suitable for architecture or real estate.'
      },
      {
        keyword: 'site lie',
        explanation: 'Search for content related to "lies" (possibly about false information or deception), suitable for research or verification.'
      },
      {
        keyword: 'site ap human geography',
        explanation: 'Search for AP human geography resources or learning materials, possibly content from educational platforms.'
      },
      {
        keyword: 'site drive.google.com pelicula memorias de un caracol',
        explanation: 'Search for the movie "Memorias de un Caracol" on Google Drive, possibly for finding free or shared movie files.'
      }
    ]
  },
  {
    category: 'intitle:',
    description: 'Search for pages with specific words in the title',
    keywords: [
      {
        keyword: 'intitle:riddles',
        explanation: 'Search for pages with "riddles" in the title, suitable for finding riddles or brain teasers.'
      },
      {
        keyword: 'intitle:literally',
        explanation: 'Search for pages with "literally" in the title, possibly focusing on language use or precise expression.'
      },
      {
        keyword: 'intitle:guest',
        explanation: 'Search for pages with "guest" in the title, possibly guest blogs, access pages, or hotel content.'
      },
      {
        keyword: 'intitle:how to change pad color on the akai mpd226',
        explanation: 'Search for pages with how to change the pad color on the Akai MPD226 MIDI controller, very specific technical query.'
      },
      {
        keyword: 'intitle:admin intitle:login',
        explanation: 'Search for pages with both "admin" and "login" in the title, commonly used for finding management login pages.'
      }
    ]
  },
  {
    category: 'allintitle:',
    description: 'Search for pages with all specified words in the title',
    keywords: [
      {
        keyword: 'allintitle:your honor showtime cast',
        explanation: 'Search for pages with all words in "your honor showtime cast" in the title, for the cast of the Showtime series "Your Honor".'
      },
      {
        keyword: 'allintitle:home cleaning services',
        explanation: 'Search for pages with all words in "home cleaning services" in the title, suitable for finding home cleaning service providers.'
      },
      {
        keyword: 'allintitle:house cleaning services',
        explanation: 'Search for pages with all words in "house cleaning services" in the title, similar to home cleaning but more specific to residential cleaning.'
      },
      {
        keyword: 'allintitle:when is amazon prime day',
        explanation: 'Search for pages with all words in "when is amazon prime day" in the title, for finding the date of the Amazon Prime Day event.'
      },
      {
        keyword: 'allintitle:best football club jersey',
        explanation: 'Search for pages with all words in "best football club jersey" in the title, for finding football club jersey recommendations.'
      }
    ]
  },
  {
    category: 'inurl:',
    description: 'Search for pages with specific words in the URL',
    keywords: [
      {
        keyword: 'inurl:architects',
        explanation: 'Search for pages with "architects" in the URL, possibly architecture firm, portfolio, or professional services.'
      },
      {
        keyword: 'inurl:leasing',
        explanation: 'Search for pages with "leasing" in the URL, suitable for finding rental companies, property leasing, or equipment leasing services.'
      },
      {
        keyword: 'inurl:google career',
        explanation: 'Search for pages with "google career" in the URL, for Google company job posting or career page.'
      },
      {
        keyword: 'inurl:admin login',
        explanation: 'Search for pages with "admin login" in the URL, commonly used for locating website management login pages, for testing or security purposes.'
      },
      {
        keyword: 'inurl:cdn filetype:mp4',
        explanation: 'Search for content in the URL with "cdn" and is MP4 file, for video content hosted on content distribution networks.'
      }
    ]
  },
  {
    category: 'allinurl:',
    description: 'Search for pages with all specified words in the URL',
    keywords: [
      {
        keyword: 'allinurl:architects',
        explanation: 'Search for pages with "architects" in the URL, for architecture firm, portfolio, or professional services.'
      },
      {
        keyword: 'allinurl:leasing',
        explanation: 'Search for pages with "leasing" in the URL, suitable for finding rental companies, property leasing, or equipment leasing services.'
      },
      {
        keyword: 'allinurl:google career',
        explanation: 'Search for pages with "google career" in the URL, for Google company job posting or career page.'
      },
      {
        keyword: 'allinurl:admin login',
        explanation: 'Search for pages with both "admin" and "login" in the URL, commonly used for locating website management login pages.'
      },
      {
        keyword: 'allinurl:diversity',
        explanation: 'Search for pages with "diversity" in the URL, commonly used for finding enterprise diversity initiatives, policies, or educational resources.'
      }
    ]
  },
  {
    category: 'intext:',
    description: 'Search for pages with specific words in the text',
    keywords: [
      {
        keyword: 'intext:kitty leroux',
        explanation: 'Search for pages with "Kitty Leroux" in the text, possibly referring to content creator or influencer.'
      },
      {
        keyword: 'intext:the n ext:asp',
        explanation: 'Search for pages with "the n" and file extension ".asp" in the text, possibly for finding legacy ASP web pages or technical documents.'
      },
      {
        keyword: 'intext:password ext:log',
        explanation: 'Search for pages with "password" and is log file in the text, commonly used for finding exposed credentials or security vulnerabilities.'
      },
      {
        keyword: 'intext:\'cpn\' filetype:pdf',
        explanation: 'Search for pages with "cpn" (possibly credit privacy number or coupon) and is PDF format document.'
      },
      {
        keyword: 'intext:chase wire instructions filetype:pdf',
        explanation: 'Search for pages with Chase bank wire instructions and is PDF format document, suitable for bank or financial transactions.'
      },
      {
        keyword: 'intext:mega.nz/folder',
        explanation: 'Search for pages with Mega.nz file folder link in the text, commonly used for finding shared files.'
      },
      {
        keyword: 'intext:that1iggirl',
        explanation: 'Search for pages with "that1iggirl" in the text, possibly related to social media influencer or personal content.'
      },
      {
        keyword: 'filetype:env intext:db_password',
        explanation: 'Search for pages with "db_password" and is .env file in the text, commonly used for finding exposed database credentials.'
      }
    ]
  },
  {
    category: 'allintext:',
    description: 'Search for pages with all specified words in the text',
    keywords: [
      {
        keyword: 'allintext:user filetype:log',
        explanation: 'Search for pages with "user" and is log file in the text, possibly used for system logs, user activity tracking, or security auditing.'
      },
      {
        keyword: 'allintext:payment filetype:log',
        explanation: 'Search for pages with "payment" and is log file in the text, possibly used for transaction records or financial system logs.'
      },
      {
        keyword: 'allintext:username filetype:log',
        explanation: 'Search for pages with "username" and is log file in the text, commonly used for analyzing user authentication or access logs.'
      },
      {
        keyword: 'allintext:adhaar filetype:xlsx',
        explanation: 'Search for pages with "adhaar" and is Excel file in the text, possibly data set or template related to Indian Aadhaar identity system.'
      }
    ]
  },
  {
    category: 'other',
    description: 'Combine multiple operators to create more precise searches',
    keywords: [
      {
        keyword: 'filetype:pdf intitle:the secret',
        explanation: 'Search for PDF format document with "the secret" in the title, possibly for the book "The Secret" or related content.'
      },
      {
        keyword: 'site:edu filetype:pdf machine learning',
        explanation: 'Search for machine learning-related PDF documents on educational institution websites, suitable for academic research.'
      },
      {
        keyword: 'inurl:cdn filetype:mp4',
        explanation: 'Search for MP4 format video files in the URL with "cdn", for video content hosted on content distribution networks.'
      },
      {
        keyword: 'intext:mega.nz/folder',
        explanation: 'Search for pages with Mega.nz file folder link in the text, commonly used for finding shared files.'
      },
      {
        keyword: 'filetype:env intext:db_password',
        explanation: 'Search for pages with "db_password" and is .env file in the text, commonly used for finding exposed database credentials.'
      },
      {
        keyword: 'treasure chest filetype:gif before:2005',
        explanation: 'Search for treasure chest GIF images related to 2005 before, combining file type and time restriction.'
      },
      {
        keyword: 'inurl:pastebin intitle:mastercard',
        explanation: 'Search for pages with "mastercard" in the title on Pastebin, possibly for finding shared or leaked Mastercard related data.'
      }
    ]
  }
];

// Extract all operator categories as tags
const operatorTags = ['ALL', ...googleOperators.map(op => op.category)];

const ExamplesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setSearchTerm('');
  };

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword)
      .then(() => {
        setCopiedKeyword(keyword);
        setTimeout(() => setCopiedKeyword(null), 2000); // Clear copied status after 2 seconds
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const getActiveTagDescription = () => {
    if (activeTag === 'all') {
      return 'All search operators and examples';
    }
    
    const category = googleOperators.find(op => op.category === activeTag);
    return category ? category.description : '';
  };

  const getFilteredKeywords = () => {
    let keywords: { keyword: string; explanation: string; category: string }[] = [];
    
    // If it's ALL tag, collect keywords from all operators
    if (activeTag === 'all') {
      googleOperators.forEach(op => {
        op.keywords.forEach(k => {
          keywords.push({
            ...k,
            category: op.category
          });
        });
      });
    } else {
      // Otherwise only get keywords from the selected category
      const activeOperator = googleOperators.find(op => op.category === activeTag);
      if (activeOperator) {
        keywords = activeOperator.keywords.map(k => ({
          ...k,
          category: activeOperator.category
        }));
      }
    }
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      keywords = keywords.filter(item => 
        item.keyword.toLowerCase().includes(searchLower) || 
        item.explanation.toLowerCase().includes(searchLower)
      );
    }
    
    return keywords;
  };

  const handleSearch = (keyword: string) => {
    const encodedKeyword = encodeURIComponent(keyword);
    window.open(`https://www.google.com/search?q=${encodedKeyword}`, '_blank');
  };

  const filteredKeywords = getFilteredKeywords();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEOHead 
        title="高级搜索命令示例 | filetype、site、intext搜索技巧" 
        description="查看丰富的Google高级搜索命令示例，包括filetype:pdf查找文档、site:edu限定教育网站、intitle精确标题搜索等，提升您的信息检索能力。" 
        keywords="filetype:pdf intitle:the secret,filetype:pdf three-body problem,filetype:mp4,filetype:mp3,site:edu,site:gov,intext:search,allintitle,allintext,inurl:admin,高级搜索示例,Google搜索技巧"
        canonicalUrl="https://seokeywords.com/examples"
      />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            Search Keyword Examples
          </h1>
          
          <div className="flex justify-center">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl md:max-w-full mx-auto leading-relaxed">
              Browse our collection of advanced search operators and examples to improve your search skills.
            </p>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Search Operators
            </h2>
            
            <div className="relative w-full md:w-96">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search keywords or explanations..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Tags/Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={() => handleTagChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTag === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {googleOperators.map(op => (
              <button 
                key={op.category}
                onClick={() => handleTagChange(op.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeTag === op.category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {op.category}
              </button>
            ))}
          </div>
          
          {/* Active tag description */}
          {getActiveTagDescription() && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-700">{getActiveTagDescription()}</p>
            </div>
          )}
        </div>
        
        {/* Results Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            {activeTag === 'all' ? 'All Search Operators' : `${activeTag} Examples`}
            <span className="text-gray-500 text-sm font-normal ml-2">({filteredKeywords.length} examples)</span>
          </h2>
          
          {filteredKeywords.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search Keyword
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Explanation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredKeywords.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 text-left">
                        <code className="bg-gray-100 px-2 py-1 rounded text-blue-700">{item.keyword}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 text-left">
                        {item.explanation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleCopyKeyword(item.keyword)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Copy to clipboard"
                            aria-label={`Copy keyword ${item.keyword}`}
                          >
                            {copiedKeyword === item.keyword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleSearch(item.keyword)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Search on Google"
                            aria-label={`Search for ${item.keyword} on Google`}
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No matching keywords found. Try a different search term.</p>
            </div>
          )}
        </div>
        
        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tips for Advanced Searching
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Combine Operators</h3>
              <p className="text-gray-600">
                You can combine multiple search operators to create highly specific searches. For example: <span className="font-mono bg-gray-100 px-1">site:edu filetype:pdf "machine learning"</span>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Use Quotes for Exact Matches</h3>
              <p className="text-gray-600">
                Put phrases in quotes to search for the exact words in the exact order. For example: <span className="font-mono bg-gray-100 px-1">"artificial intelligence ethics"</span>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Exclude Terms</h3>
              <p className="text-gray-600">
                Use the minus sign to exclude certain terms from your search. For example: <span className="font-mono bg-gray-100 px-1">python programming -snake</span>
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Use OR for Alternatives</h3>
              <p className="text-gray-600">
                Use OR (in capital letters) between terms to search for either term. For example: <span className="font-mono bg-gray-100 px-1">marketing OR advertising</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage; 