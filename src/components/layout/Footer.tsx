import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First column - About Us */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
            <p className="text-gray-600 mb-4">
              SEO Keywords Generator is a professional tool that helps users create advanced search keywords to improve website search engine optimization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Second column - Quick Links */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link to="/explain" className="text-gray-600 hover:text-gray-900">Keyword Explanation</Link>
              </li>
              <li>
                <Link to="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Third column - Supported Languages */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported Languages</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">English</li>
            </ul>
          </div>

          {/* Fourth column - Contact Us */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <p className="text-gray-600">
              Have any questions or suggestions? Feel free to contact us.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Email icon */}
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=591124281yj@gmail.com&su=Inquiry from SEO Keywords Generator" className="text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer" title="Email us">
                <span className="sr-only">Email</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              {/* Telegram icon */}
              <a href="https://t.me/yangjerry666" className="text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer" title="Contact us on Telegram">
                <span className="sr-only">Telegram</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.484 3.055-.681 4.559l-.57 3.968c-.05.34-.183.425-.335.425-.152 0-.334-.078-.519-.224l-2.818-2.088-1.359 1.308c-.151.146-.278.267-.456.267-.117 0-.231-.062-.284-.344l-.638-2.113-2.753-.853c-.292-.09-.292-.292.061-.436l10.674-4.129c.151-.056.334-.017.38.146z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-left text-gray-500">
          <p>© {currentYear} SEO Keywords Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 