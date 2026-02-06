"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen, ShieldCheck, BrainCircuit, Menu, X, Globe, Rocket, CheckCircle, Play, Lock, Layout, ListChecks, PieChart, MousePointer2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/shared';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  
  // Signup Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

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

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSigningUp(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSigningUp(false);
    setSignupSuccess(true);
    
    // Redirect after brief success message
    setTimeout(() => {
      router.push('/educator');
    }, 1000);
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

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 flex-grow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Value + Signup */}
          <div className="flex flex-col text-left z-10 animate-fade-in-up">
             <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-[#0F172A] mb-6 leading-tight">
               Create a Classroom-Ready Lesson in <span className="text-[#00b6ff]">Under 2 Minutes</span>
             </h1>
             <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
               AI-powered lesson creation that saves teachers 5+ hours per week.
             </p>

             {/* Signup Card */}
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b6ff] to-blue-400"></div>
               <div className="text-sm font-bold text-[#00b6ff] uppercase tracking-wider mb-6">Start free — built for educators</div>
               
               <ul className="space-y-3 mb-8">
                 <li className="flex items-center text-slate-700 font-medium">
                   <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                   Save hours on lesson planning
                 </li>
                 <li className="flex items-center text-slate-700 font-medium">
                   <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                   Curriculum-aligned automatically
                 </li>
                 <li className="flex items-center text-slate-700 font-medium">
                   <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                   No student data collected
                 </li>
               </ul>

               <form onSubmit={handleTeacherSignup} className="space-y-4">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSigningUp || signupSuccess}
                  />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSigningUp || signupSuccess}
                  />
                  <Button 
                    className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-[#00b6ff]/25 transition-all duration-300 ${signupSuccess ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    disabled={isSigningUp || signupSuccess}
                  >
                    {isSigningUp ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...
                      </span>
                    ) : signupSuccess ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> Success! Redirecting...
                      </span>
                    ) : (
                      'Start Free & Create My First Lesson →'
                    )}
                  </Button>
               </form>

               <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 23 23" fill="currentColor"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                    Microsoft
                  </button>
               </div>

               <div className="mt-6 text-xs text-slate-400 text-center font-medium">
                 No credit card • Free forever tier • Setup in 60 seconds
               </div>
             </div>
          </div>

          {/* Right Column: Product Preview */}
          <div className="relative z-10 hidden lg:block animate-fade-in-up delay-200">
             {/* Abstract background blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#00b6ff]/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
             
             {/* Floating Label */}
             <div className="absolute -top-6 -right-6 z-20 bg-[#0F172A] text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold transform rotate-3 flex items-center animate-bounce">
               <Sparkles className="w-4 h-4 text-[#00b6ff] mr-2" />
               This is what you’ll build after signup
             </div>

             {/* Mock UI Card */}
             <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-[-1deg] hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto">
                {/* Header of mock app */}
                <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center text-[#00b6ff]">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F172A]">Grade 5 Fractions</h3>
                      <p className="text-xs text-slate-500">Interactive Lesson</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                    <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                
                <div className="flex h-80">
                  {/* Sidebar */}
                  <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-4 space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Layout className="w-4 h-4" />
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 text-[#00b6ff] bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                      <Play className="w-4 h-4" />
                      <span className="text-xs font-bold">Activities</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <ListChecks className="w-4 h-4" />
                      <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-[#0F172A]">Activity 1: Visualizing Halves</h4>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Student View</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                      <div className="flex gap-8">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center relative group cursor-pointer hover:border-[#00b6ff] transition-colors">
                          <div className="absolute inset-0 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="relative z-10 font-bold text-slate-400 group-hover:text-[#00b6ff]">1/3</span>
                        </div>
                        <div className="w-20 h-20 rounded-full border-4 border-[#00b6ff] flex items-center justify-center relative cursor-pointer shadow-lg shadow-[#00b6ff]/20">
                          <div className="absolute top-0 bottom-0 left-0 right-1/2 bg-[#00b6ff]/10 rounded-l-full border-r border-[#00b6ff]"></div>
                          <span className="relative z-10 font-bold text-[#00b6ff]">1/2</span>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                            <MousePointer2 className="w-5 h-5 text-[#00b6ff] fill-[#00b6ff]" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 text-center">Select the shape that represents 1/2</p>
                    </div>

                    <div className="mt-auto flex justify-end">
                      <div className="px-4 py-2 bg-[#00b6ff] text-white text-xs font-bold rounded-lg shadow-md">
                        Next Activity →
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 w-full animate-fade-in-up delay-300">
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

