"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen, ShieldCheck, BrainCircuit, Menu, X, Globe, Rocket } from 'lucide-react';
import { Button } from '../components/ui/shared';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (classCode.length >= 6) {
      router.push(`/student/journey/${classCode.toUpperCase()}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'FR' : 'EN');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden selection:bg-[#00b6ff]/30 flex flex-col font-sans">
      
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center shadow-md shadow-[#00b6ff]/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">
              IDÉLL<span className="text-[#00b6ff]">IA</span>
            </span>
          </div>

          {/* Center: Pricing & Class Code (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors">
              Pricing
            </Link>
            
            <form onSubmit={handleJoinClass} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Rocket className="h-4 w-4 text-slate-400 group-focus-within:text-[#00b6ff] transition-colors" />
              </div>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Enter Class Code"
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#00b6ff] focus:ring-2 focus:ring-[#00b6ff]/10 w-48 transition-all shadow-sm"
                maxLength={6}
              />
            </form>
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors px-2 py-1 rounded-md hover:bg-slate-50"
            >
              <Globe className="w-4 h-4" />
              {language}
            </button>
            
            <div className="h-4 w-px bg-slate-200"></div>
            
            <Link href="/educator" className="text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors">
              Log in
            </Link>
            
            <Button 
              onClick={() => router.push('/educator')}
              className="bg-[#00b6ff] hover:bg-[#0095d1] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#00b6ff]/20"
            >
              Sign Up Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#00b6ff]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-6 md:hidden flex flex-col gap-6 animate-fade-in-up">
            <Link href="#" className="text-base font-medium text-slate-600 hover:text-[#00b6ff]">
              Pricing
            </Link>
            
            <form onSubmit={handleJoinClass} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Rocket className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Enter Class Code"
                className="pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00b6ff] w-full"
                maxLength={6}
              />
            </form>

            <div className="h-px bg-slate-100 w-full"></div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Language</span>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 text-sm font-bold text-[#00b6ff] bg-[#00b6ff]/10 px-3 py-1 rounded-full"
                >
                  <Globe className="w-4 h-4" />
                  {language}
                </button>
              </div>
              
              <Link href="/educator" className="text-center py-3 text-slate-600 font-medium hover:text-[#00b6ff]">
                Log in
              </Link>
              
              <Button 
                onClick={() => router.push('/educator')}
                className="w-full bg-[#00b6ff] hover:bg-[#0095d1] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#00b6ff]/20"
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00b6ff]/10 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40 flex flex-col items-center text-center flex-grow">
        
        {/* Hero Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-[#00b6ff] mr-2" />
          <span className="text-sm font-medium text-slate-600">IDÉLLIA: AI-Powered Learning Journeys</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#0F172A] animate-fade-in-up delay-100">
          Transform Passive Content into <br className="hidden md:block" />
          <span className="text-[#00b6ff]">Active Learning</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-200">
          Generate curriculum-aligned learning journeys in under 2 minutes with IDÉLLIA. 
          Secure, culturally relevant, and designed for the modern classroom.
        </p>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-fade-in-up delay-300">
          
          {/* Educator Card */}
          <Link href="/educator" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b6ff] to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#00b6ff]/50 hover:shadow-xl hover:shadow-[#00b6ff]/10 transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#00b6ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <GraduationCap className="w-8 h-8 text-[#00b6ff]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">I am an Educator</h2>
              <p className="text-slate-500 mb-6">
                Create structured lesson plans, discover resources, and deploy to your class instantly.
              </p>
              <div className="mt-auto flex items-center text-[#00b6ff] font-medium group-hover:text-[#0095d1]">
                Start Building <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Student Card */}
          <Link href="/student" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b6ff] to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#00b6ff]/50 hover:shadow-xl hover:shadow-[#00b6ff]/10 transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#00b6ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <Users className="w-8 h-8 text-[#00b6ff]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">I am a Student</h2>
              <p className="text-slate-500 mb-6">
                Enter your class code to access your personalized learning journey.
              </p>
              <div className="mt-auto flex items-center text-[#00b6ff] font-medium group-hover:text-[#0095d1]">
                Join Class <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 w-full max-w-6xl animate-fade-in-up delay-500">
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-[#00b6ff]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Curriculum Aligned</h3>
            <p className="text-slate-500 text-sm">Every resource is vetted and mapped to specific learning outcomes.</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#00b6ff]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Privacy First</h3>
            <p className="text-slate-500 text-sm">No student data collection. Anonymous access via class codes.</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#00b6ff]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Culturally Relevant</h3>
            <p className="text-slate-500 text-sm">Prioritizing diverse voices and local indigenous content.</p>
          </div>
        </div>

      </div>

      {/* Footer / Trust Section */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#00b6ff]/5 border border-[#00b6ff]/10 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
               <span className="text-sm font-bold tracking-wider text-[#00b6ff] uppercase">Powered by IDÉLLO</span>
            </div>
            <p className="text-slate-700 text-lg font-medium leading-relaxed">
              IDÉLLIA utilizes the certified 15,000+ resource library of <a href="#" className="text-[#00b6ff] hover:underline font-bold">IDÉLLO</a> to ensure 100% pedagogical safety.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-6 text-sm text-slate-400">
             <span>&copy; {new Date().getFullYear()} IDÉLLIA</span>
             <a href="#" className="hover:text-[#00b6ff] transition-colors">Privacy</a>
             <a href="#" className="hover:text-[#00b6ff] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

