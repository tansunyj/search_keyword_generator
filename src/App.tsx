import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// 导入布局组件
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GoogleAnalytics from './components/GoogleAnalytics';

// 导入页面组件
import HomePage from './pages/HomePage';
import ExplainPage from './pages/ExplainPage';
import ExamplesPage from './pages/ExamplesPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="App flex flex-col min-h-screen">
          <GoogleAnalytics />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explain" element={<ExplainPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
