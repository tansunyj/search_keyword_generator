import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              SEO Keywords Generator
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/explain" className="text-gray-600 hover:text-gray-900">Keyword Explanation</Link>
            <Link to="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/explain" className="text-gray-600 hover:text-gray-900">Keyword Explanation</Link>
              <Link to="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 