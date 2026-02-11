'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  Lightbulb,
  Search,
  BookOpen,
  Clock,
  GraduationCap,
  BrainCircuit,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { Button } from '../../components/ui/shared';
import { generateJourney } from '../../lib/journeys';
import {
  isAuthenticated,
  login,
  signup,
  getEducatorData,
} from '../../lib/auth';

export default function EducatorBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);

    // Auto-focus the textarea on mount if authenticated
    if (authenticated && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('educator_data');
    setIsAuth(false);
    setShowUserMenu(false);
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      setIsAuth(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signup({ email, password, name: name || email.split('@')[0] });
      setIsAuth(true);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const journey = await generateJourney(prompt);
      router.push(`/educator/journey/${journey.id}`);
    } catch (error) {
      console.error('Failed to generate journey', error);
      setIsGenerating(false);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate journey';
      if (errorMessage.includes('Invalid or expired token')) {
        setError('Your session has expired. Please log in again.');
        setIsAuth(false);
      } else {
        setError(errorMessage);
      }
    }
  };

  const suggestions = [
    'Grade 5 Science: Photosynthesis & Plant Life',
    "French Vocabulary: 'Les Saisons' (The Seasons)",
    'English: Creative Writing & Story Structure',
    'Indigenous Perspectives: Plant Medicine',
  ];

  // If not authenticated, show login/signup form
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-slate-500 hover:text-[#0F172A]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2 hidden sm:flex">
                <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center shadow-md shadow-[#00b6ff]/20">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                  IDÉLLIA
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg shadow-slate-100 mb-6 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#00b6ff] flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight">
              {showLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-lg">
              {showLogin
                ? 'Log in to start creating learning journeys'
                : 'Sign up to start creating learning journeys'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-[#00b6ff] via-cyan-400 to-blue-500 opacity-50"></div>

            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form
                onSubmit={showLogin ? handleLogin : handleSignup}
                className="space-y-4"
              >
                {!showLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@school.edu"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full py-3 bg-[#00b6ff] hover:bg-[#0095d1] text-white shadow-lg shadow-[#00b6ff]/25 border-0 rounded-xl font-semibold"
                >
                  {showLogin ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" /> Log In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" /> Sign Up
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowLogin(!showLogin);
                    setError(null);
                  }}
                  className="text-sm text-slate-600 hover:text-[#00b6ff] transition-colors"
                >
                  {showLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Log in'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated view - show journey builder
  const educatorData = getEducatorData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center shadow-md shadow-[#00b6ff]/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">
              IDÉLLIA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1 bg-[#00b6ff]/10 text-[#00b6ff] rounded-full text-xs font-medium border border-[#00b6ff]/20">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              Educator Page
            </div>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-[#00b6ff] text-white flex items-center justify-center text-sm font-bold shadow-md hover:bg-[#0095d1] transition-colors cursor-pointer"
              >
                {educatorData?.name?.charAt(0).toUpperCase() || 'E'}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-700">
                      {educatorData?.name || 'Educator'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {educatorData?.email || ''}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-slate-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
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
            Design Your Next{' '}
            <span className="text-[#00b6ff]">Learning Journey</span>
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your lesson ideas into structured, curriculum-aligned
            journeys in seconds. Just describe what you want to teach.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-fade-in-up delay-100">
          <div className="p-1 bg-gradient-to-r from-[#00b6ff] via-cyan-400 to-blue-500 opacity-50"></div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="relative mb-6">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your lesson topic, grade level, and learning goals... (e.g., 'Create a 45-minute interactive lesson on the solar system for Grade 5, focusing on Mars exploration and including a hands-on activity.')"
                className="w-full h-48 p-5 text-lg text-slate-700 placeholder:text-slate-400 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none resize-none transition-all duration-200 ease-in-out"
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
                <span>
                  Searching{' '}
                  <span className="font-semibold text-slate-700">15,000+</span>{' '}
                  certified resources
                </span>
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
                  {i % 2 === 0 ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <span className="text-slate-600 font-medium group-hover:text-[#0F172A] transition-colors">
                  {s}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
