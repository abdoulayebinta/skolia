"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Lightbulb, Search, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { Button, Card } from '../../components/ui/shared';
import { generateJourneyFromPrompt } from '../../lib/mockData';

export default function EducatorBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const journey = await generateJourneyFromPrompt(prompt);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`journey_draft_${journey.id}`, JSON.stringify(journey));
      }
      router.push(`/educator/journey/${journey.id}`);
    } catch (error) {
      console.error("Failed to generate journey", error);
      setIsGenerating(false);
    }
  };

  const suggestions = [
    "Grade 5 Science: Photosynthesis & Plant Life",
    "French Vocabulary: 'Les Saisons' (The Seasons)",
    "English: Creative Writing & Story Structure",
    "Indigenous Perspectives: Plant Medicine"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hidden sm:block">
              CurriculaMap
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              Educator Mode
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-lg shadow-indigo-100 mb-6 border border-indigo-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Design Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Learning Journey</span>
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your lesson ideas into structured, curriculum-aligned journeys in seconds. 
            Just describe what you want to teach.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-fade-in-up delay-100">
          <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 opacity-10"></div>
          
          <div className="p-6 sm:p-8">
            <div className="relative mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your lesson topic, grade level, and learning goals... (e.g., 'Create a 45-minute interactive lesson on the solar system for Grade 5, focusing on Mars exploration and including a hands-on activity.')"
                className="w-full h-48 p-5 text-lg text-slate-700 placeholder:text-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all duration-200 ease-in-out"
                maxLength={500}
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100">
                {prompt.length} / 500
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Search className="w-4 h-4 mr-2 text-indigo-500" />
                <span>Searching <span className="font-semibold text-slate-700">15,000+</span> certified resources</span>
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || isGenerating}
                isLoading={isGenerating}
                size="lg"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 border-0 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
                className="group flex items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                  {i % 2 === 0 ? <BookOpen className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
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

