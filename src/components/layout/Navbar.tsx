import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAE8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#102A2A] flex items-center justify-center text-[#C6A76A] shadow-md shadow-[#102A2A]/20 group-hover:scale-105 transition-transform border border-[#C6A76A]/30">
            <Wallet className="w-6 h-6 text-[#C6A76A]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#202B29] group-hover:text-[#23866B] transition-colors">
              Student<span className="text-[#23866B]">Wallet</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[#C6A76A]">
              Campus Finance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-[#78877F] hover:text-[#23866B] transition-colors">
            Home
          </Link>
          <a href="#features" className="text-sm font-semibold text-[#78877F] hover:text-[#23866B] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-[#78877F] hover:text-[#23866B] transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-sm font-semibold text-[#78877F] hover:text-[#23866B] transition-colors">
            About
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#23866B] hover:bg-[#1C6C56] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#202B29] hover:text-[#23866B] rounded-lg hover:bg-[#F5F3ED]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EAE8E1] bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#202B29] hover:text-[#23866B]"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#202B29] hover:text-[#23866B]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#202B29] hover:text-[#23866B]"
            >
              How It Works
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#202B29] hover:text-[#23866B]"
            >
              About
            </a>
          </nav>
          <div className="pt-3 border-t border-[#EAE8E1] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full inline-flex justify-center items-center gap-2 py-3 bg-[#23866B] text-white font-semibold rounded-xl"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
