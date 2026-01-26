"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Lightbulb, Search } from 'lucide-react';
import { Button, Card } from '../../components/ui/shared';
import { generateJourneyFromPrompt, saveJourney } from '../../lib/mockData';

export default function EducatorBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const journey = await generateJourneyFromPrompt(prompt);
      // Save temporarily to local storage to retrieve by ID in the next page
      // In a real app, this would be a DB save
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
    "Grade 5 Science lesson on Photosynthesis",
    "French vocabulary for 'Les Saisons'",
    "Creative writing prompts for English",
    "Indigenous plant medicine and nature"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Journey Builder
            </span>
          </div>
          <div className="text-sm text-slate-500">
            Educator Mode
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            What do you want to teach today?
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Describe your topic, grade level, and learning goals. Our AI will curate the perfect sequence of resources.
          </p>
        </div>

        <Card className="p-6 shadow-lg border-blue-100 mb-8">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I need a 45-minute lesson on the solar system for Grade 5 students, focusing on Mars exploration..."
              className="w-full h-40 p-4 text-lg rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all"
              disabled={isGenerating}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400">
              {prompt.length}/500
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-slate-500">
              <Search className="w-4 h-4 mr-2" />
              Searching 15,000+ certified resources
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              isLoading={isGenerating}
              size="lg"
              className="px-8"
            >
              Generate Journey
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" /> Try these prompts
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="text-left p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-slate-700 text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

