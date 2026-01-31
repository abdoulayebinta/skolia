"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, Play, BookOpen, Gamepad2, RotateCcw, Home, Star, Trophy, Sparkles, Clock, Headphones } from 'lucide-react';
import { Button } from '../../../../components/ui/shared';
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00b6ff]"></div>
      </div>
    );
  }

  if (!journey) return null;

  if (completed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="mb-8 relative animate-bounce">
          <div className="absolute inset-0 bg-[#00b6ff] blur-3xl opacity-20 rounded-full"></div>
          <div className="relative bg-gradient-to-br from-[#00b6ff] to-blue-500 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-[#00b6ff]/30 border-4 border-white">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] mb-4 tracking-tight">
          Awesome Job!
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-lg font-medium">
          You've completed the <span className="text-[#00b6ff] font-bold">"{journey.title}"</span> journey.
        </p>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 max-w-md w-full mb-10 border border-slate-100">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-[#00b6ff]" />
            What you learned
          </h3>
          <ul className="text-left space-y-3 text-slate-600">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-3 text-[#00b6ff] flex-shrink-0 mt-0.5" />
              <span>Explored key concepts in {journey.subject}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-3 text-[#00b6ff] flex-shrink-0 mt-0.5" />
              <span>Completed {journey.steps.length} interactive activities</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 mr-3 text-[#00b6ff] flex-shrink-0 mt-0.5" />
              <span>Mastered new skills for Grade {journey.grade}</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            onClick={() => {
              setCompleted(false);
              setCurrentStep(0);
            }}
            className="flex-1 bg-[#00b6ff] hover:bg-[#0095d1] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#00b6ff]/20 border-0"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Start Again
          </Button>
          <Button 
            onClick={() => router.push('/')}
            className="flex-1 bg-white text-[#0F172A] hover:bg-slate-50 border-2 border-slate-200 py-4 rounded-xl font-bold text-lg"
          >
            <Home className="w-5 h-5 mr-2" /> Back Home
          </Button>
        </div>
      </div>
    );
  }

  const currentResource = journey.steps[currentStep].resource;
  const stepType = journey.steps[currentStep].stepType;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b6ff]/10 flex items-center justify-center text-[#00b6ff] font-bold text-lg">
              {currentStep + 1}
            </div>
            <div>
              <h1 className="font-bold text-[#0F172A] text-sm md:text-base line-clamp-1">{journey.title}</h1>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stepType} Phase</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
              <Clock className="w-3 h-3 mr-1.5" />
              {currentResource.duration}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 flex">
          {journey.steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-full flex-1 transition-all duration-500 ${
                idx <= currentStep ? 'bg-[#00b6ff]' : 'bg-transparent'
              } ${idx < journey.steps.length - 1 ? 'border-r border-white' : ''}`}
            />
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col h-[60vh] md:h-[70vh]">
          {/* Content Viewer (Iframe Placeholder) */}
          <div className="flex-1 bg-slate-900 relative group overflow-hidden">
            {/* Simulated Content Background */}
            <div className={`absolute inset-0 opacity-40 ${
              currentResource.type === 'video' ? 'bg-red-900' : 
              currentResource.type === 'game' ? 'bg-purple-900' : 
              'bg-blue-900'
            }`}></div>
            
            {/* Center Play Button / Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center z-10">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border-2 border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                {currentResource.type === 'video' && <Play className="w-10 h-10 ml-1" />}
                {currentResource.type === 'game' && <Gamepad2 className="w-10 h-10" />}
                {(currentResource.type === 'book' || currentResource.type === 'article') && <BookOpen className="w-10 h-10" />}
                {currentResource.type === 'podcast' && <Headphones className="w-10 h-10" />}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">{currentResource.title}</h2>
              <p className="text-lg text-white/80 max-w-2xl leading-relaxed drop-shadow-sm">
                {currentResource.description}
              </p>
              
              <div className="mt-8 px-6 py-2 bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium border border-white/10">
                Click to interact with this {currentResource.type}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-between px-6 md:px-10">
            <Button 
              variant="ghost" 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-slate-500 hover:text-[#00b6ff] hover:bg-[#00b6ff]/10 font-medium disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> Previous
            </Button>

            <div className="flex gap-2">
              {journey.steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'bg-[#00b6ff] scale-125' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              className="bg-[#00b6ff] hover:bg-[#0095d1] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-[#00b6ff]/20 border-0 transition-transform active:scale-95"
            >
              {currentStep === journey.steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

      </main>
    </div>
  );
}

