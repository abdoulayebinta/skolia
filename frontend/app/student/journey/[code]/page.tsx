"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, Play, BookOpen, Gamepad2, RotateCcw, Home } from 'lucide-react';
import { Button, Card } from '../../../../components/ui/shared';
import { getJourneyByCode, LearningJourney, Resource } from '../../../../lib/mockData';

export default function StudentPlayer() {
  const params = useParams();
  const router = useRouter();
  const [journey, setJourney] = useState<LearningJourney | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && params.code) {
      const code = Array.isArray(params.code) ? params.code[0] : params.code;
      const foundJourney = getJourneyByCode(code);
      
      if (foundJourney) {
        setJourney(foundJourney);
      } else {
        // Handle invalid code
        router.push('/student');
      }
      setLoading(false);
    }
  }, [params.code, router]);

  const handleNext = () => {
    if (!journey) return;
    
    if (currentStep < journey.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!journey) return null;

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Journey Complete!</h1>
        <p className="text-xl text-slate-400 mb-12 max-w-lg">
          Great job! You've finished the "{journey.title}" learning journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => {
              setCompleted(false);
              setCurrentStep(0);
            }}
            variant="secondary"
            className="min-w-[160px]"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Start Again
          </Button>
          <Button 
            onClick={() => router.push('/')}
            className="bg-white/10 hover:bg-white/20 text-white border-0 min-w-[160px]"
          >
            <Home className="w-4 h-4 mr-2" /> Back Home
          </Button>
        </div>
      </div>
    );
  }

  const currentResource = journey.steps[currentStep].resource;
  const stepType = journey.steps[currentStep].stepType;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-800 w-full">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / journey.steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="mr-4 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-300">
            Step {currentStep + 1} of {journey.steps.length}
          </div>
          <h2 className="font-semibold text-lg hidden md:block">{journey.title}</h2>
        </div>
        <div className="text-sm font-medium text-purple-400">
          {stepType} Phase
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-4xl relative z-10">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Resource Viewer Placeholder */}
            <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center relative group">
              {/* Simulated Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-50"></div>
              
              <div className="relative z-10 text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10">
                  {currentResource.type === 'video' && <Play className="w-8 h-8 text-white" />}
                  {currentResource.type === 'game' && <Gamepad2 className="w-8 h-8 text-white" />}
                  {(currentResource.type === 'book' || currentResource.type === 'article') && <BookOpen className="w-8 h-8 text-white" />}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{currentResource.title}</h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                  {currentResource.description}
                </p>
                
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400">
                  This is a placeholder for the actual {currentResource.type} content.
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 md:p-8 bg-slate-900/30 border-t border-white/5 flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-slate-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>

              <div className="flex gap-2">
                {journey.steps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentStep ? 'bg-purple-500 scale-125' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <Button 
                onClick={handleNext}
                className="bg-white text-slate-900 hover:bg-slate-200 border-0 px-8"
              >
                {currentStep === journey.steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

