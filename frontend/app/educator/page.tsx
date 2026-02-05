"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Lightbulb, Search, BookOpen, Clock, GraduationCap, BrainCircuit, LogOut, User } from 'lucide-react';
import { Button, Card } from '../../components/ui/shared';
import { generateJourney, createJourney } from '../../lib/journeys';
import {
  signup,
  login,
  logout,
  isAuthenticated,
  getEducatorData,
  type SignupData,
  type LoginData,
  type Educator
} from '../../lib/auth';

export default function EducatorBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [educator, setEducator] = useState<Educator | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Auth form state
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    // Check if user is authenticated on mount
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const educatorData = getEducatorData();
      setEducator(educatorData);
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    setIsGenerating(true);
    setAuthError('');
    
    try {
      // Step 1: Generate the journey (draft)
      const generatedJourney = await generateJourney(prompt);
      
      // Step 2: Save the journey to the database
      const savedJourney = await createJourney({
        id: generatedJourney.id,
        title: generatedJourney.title,
        subject: generatedJourney.subject,
        grade: generatedJourney.grade,
        prompt: prompt,
        steps: generatedJourney.steps.map(step => ({
          step_type: step.step_type,
          resource_id: step.resource.id
        }))
      });
      
      // Step 3: Redirect to the journey page with the MongoDB ObjectId
      router.push(`/educator/journey/${savedJourney.id}`);
    } catch (error) {
      console.error("Failed to generate journey", error);
      setAuthError(error instanceof Error ? error.message : 'Failed to generate journey');
      setIsGenerating(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const signupData: SignupData = {
          email: authForm.email,
          password: authForm.password,
          name: authForm.name
        };
        const response = await signup(signupData);
        setEducator(response.educator);
        setIsLoggedIn(true);
        setShowAuthModal(false);
      } else {
        const loginData: LoginData = {
          email: authForm.email,
          password: authForm.password
        };
        const response = await login(loginData);
        setEducator(response.educator);
        setIsLoggedIn(true);
        setShowAuthModal(false);
      }
      
      // Reset form
      setAuthForm({ email: '', password: '', name: '' });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setEducator(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const suggestions = [
    "Grade 5 Science: Photosynthesis & Plant Life",
    "French Vocabulary: 'Les Saisons' (The Seasons)",
    "English: Creative Writing & Story Structure",
    "Indigenous Perspectives: Plant Medicine"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#00b6ff]/5 text-[#0F172A] font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-slate-500 hover:text-[#0F172A]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center shadow-md shadow-[#00b6ff]/20">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                IDÉLL<span className="text-[#00b6ff]">IA</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1 bg-[#00b6ff]/10 text-[#00b6ff] rounded-full text-xs font-medium border border-[#00b6ff]/20">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              Educator Mode
            </div>
            
            {isLoggedIn && educator ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm font-medium text-slate-600">{educator.name}</span>
                <div className="w-8 h-8 rounded-full bg-[#00b6ff] text-white flex items-center justify-center text-sm font-bold shadow-md">
                  {getInitials(educator.name)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="sm"
                className="bg-[#00b6ff] hover:bg-[#0095d1] text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg shadow-slate-100 mb-6 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#00b6ff] flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight">
            Design Your Next <span className="text-[#00b6ff]">Learning Journey</span>
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your lesson ideas into structured, curriculum-aligned journeys in seconds. 
            Just describe what you want to teach.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-fade-in-up delay-100">
          <div className="p-1 bg-gradient-to-r from-[#00b6ff] via-cyan-400 to-blue-500 opacity-50"></div>
          
          <div className="p-6 sm:p-8">
            <div className="relative mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your lesson topic, grade level, and learning goals... (e.g., 'Create a 45-minute interactive lesson on the solar system for Grade 5, focusing on Mars exploration and including a hands-on activity.')"
                className="w-full h-48 p-5 text-lg text-slate-700 placeholder:text-slate-400 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/20 focus:shadow-[0_0_15px_rgba(0,182,255,0.15)] outline-none resize-none transition-all duration-200 ease-in-out"
                maxLength={500}
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100">
                {prompt.length} / 500
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center text-sm text-slate-500 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-slate-100">
                <Search className="w-4 h-4 mr-2 text-[#00b6ff]" />
                <span>Searching <span className="font-semibold text-slate-700">15,000+</span> certified resources</span>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || isGenerating}
                isLoading={isGenerating}
                size="lg"
                className="w-full sm:w-auto px-8 py-3 bg-[#00b6ff] hover:bg-[#0095d1] text-white shadow-lg shadow-[#00b6ff]/25 border-0 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {!isGenerating && <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating ? 'Crafting Journey...' : 'Generate Journey'}
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-10 animate-fade-in-up delay-200">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-slate-200 w-12 mr-4"></div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-amber-400" /> 
              Inspiration
            </h3>
            <div className="h-px bg-slate-200 w-12 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00b6ff]/50 hover:shadow-md hover:shadow-[#00b6ff]/10 transition-all duration-200 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00b6ff]/10 text-[#00b6ff] flex items-center justify-center mr-4 group-hover:bg-[#00b6ff] group-hover:text-white transition-colors duration-200">
                  {i % 2 === 0 ? <BookOpen className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <span className="text-slate-600 font-medium group-hover:text-[#0F172A] transition-colors">
                  {s}
                </span>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mb-6">
              {authMode === 'login' 
                ? 'Sign in to access your learning journeys' 
                : 'Join IDÉLLIA to start creating amazing learning experiences'}
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/20 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/20 outline-none transition-all"
                  placeholder="educator@school.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/20 outline-none transition-all"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                {authMode === 'signup' && (
                  <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                isLoading={authLoading}
                className="w-full bg-[#00b6ff] hover:bg-[#0095d1] text-white py-3 rounded-lg font-semibold"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                }}
                className="text-sm text-[#00b6ff] hover:underline"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>

            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
                setAuthForm({ email: '', password: '', name: '' });
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
