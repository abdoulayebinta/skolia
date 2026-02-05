"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, Play, BookOpen, Gamepad2, RotateCcw, Home, Star, Trophy, Sparkles, Clock, Headphones, Check, Menu } from 'lucide-react';
import { Button } from '../../../../components/ui/shared';
import { getJourneyByCode } from '../../../../lib/journeys';

// Define types locally since we're not using mockData anymore
interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  audience: string;
  duration: string;
  subject: string;
  grade: number;
  tags: string[];
  thumbnail?: string;
  contentUrl?: string;
  alignmentScore?: number;
  culturalRelevance?: boolean;
}

interface JourneyStep {
  stepType: string;
  resource: Resource;
}

interface LearningJourney {
  id: string;
  title: string;
  grade: number;
  subject: string;
  steps: JourneyStep[];
  createdAt: string;
  classCode?: string;
}

export default function StudentPlayer() {
  const params = useParams();
  const router = useRouter();
  const [journey, setJourney] = useState<LearningJourney | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadJourney = async () => {
      if (typeof window !== 'undefined' && params.code) {
        const code = Array.isArray(params.code) ? params.code[0] : params.code;
        
        try {
          const foundJourney = await getJourneyByCode(code);
          // The backend already filters out teacher resources
          setJourney(foundJourney);
        } catch (error) {
          console.error('Failed to load journey:', error);
          // Handle invalid code
          router.push('/student');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadJourney();
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      
      {/* Vertical Timeline Sidebar (Desktop) */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden md:flex flex-col p-8 overflow-y-auto z-20 shadow-sm">
        <div className="mb-8">
           <h1 className="font-bold text-xl text-[#0F172A] flex items-center">
             <span className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center text-white mr-3 shadow-md shadow-[#00b6ff]/20">
               {journey.grade}
             </span>
             My Journey
           </h1>
           <p className="text-sm text-slate-500 mt-2 line-clamp-2">{journey.title}</p>
        </div>

        <div className="relative flex-1">
           {/* Vertical Dashed Line */}
           <div className="absolute left-4 top-2 bottom-10 w-0.5 border-l-2 border-dashed border-[#00b6ff]/30"></div>

           {/* Steps */}
           <div className="space-y-8">
             {journey.steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                
                return (
                  <div key={idx} className="relative pl-12">
                     {/* Node Circle */}
                     <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-white
                        ${isCompleted ? 'bg-[#00b6ff] border-[#00b6ff]' : 
                          isActive ? 'border-[#00b6ff] ring-4 ring-[#00b6ff]/10 scale-110' : 
                          'border-slate-300'}`}
                     >
                        {isCompleted && <Check className="w-4 h-4 text-white" />}
                        {isActive && <div className="w-2.5 h-2.5 bg-[#00b6ff] rounded-full animate-pulse" />}
                     </div>

                     {/* Content */}
                     <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#00b6ff] mb-1">
                          {step.stepType}
                        </div>
                        <h3 className={`font-medium text-sm mb-2 ${isActive ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                          {step.resource.title}
                        </h3>
                        {/* Badge */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00b6ff]/10 text-[#00b6ff] uppercase tracking-wide">
                          {step.resource.type}
                        </span>
                     </div>
                  </div>
                );
             })}
           </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="w-full justify-start text-slate-500 hover:text-[#0F172A]"
          >
            <Home className="w-4 h-4 mr-2" /> Exit Class
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center text-white font-bold mr-3">
            {currentStep + 1}
          </div>
          <span className="font-bold text-[#0F172A] truncate max-w-[200px]">{journey.title}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-6">Journey Steps</h2>
            <div className="space-y-6 relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-[#00b6ff]/30"></div>
              {journey.steps.map((step, idx) => (
                <div key={idx} className="relative pl-10">
                   <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-white
                      ${idx < currentStep ? 'bg-[#00b6ff] border-[#00b6ff]' : 
                        idx === currentStep ? 'border-[#00b6ff]' : 'border-slate-300'}`}
                   >
                      {idx < currentStep && <Check className="w-3 h-3 text-white" />}
                      {idx === currentStep && <div className="w-2 h-2 bg-[#00b6ff] rounded-full" />}
                   </div>
                   <div className="text-xs font-bold text-[#00b6ff]">{step.stepType}</div>
                   <div className="text-sm text-slate-700 line-clamp-1">{step.resource.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00b6ff]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center relative z-10">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden flex flex-col h-[60vh] md:h-[75vh]">
            
            {/* Content Viewer */}
            <div className="flex-1 bg-slate-900 relative group overflow-hidden">
              <div className={`absolute inset-0 opacity-40 ${
                currentResource.type === 'video' ? 'bg-red-900' : 
                currentResource.type === 'game' ? 'bg-purple-900' : 
                'bg-blue-900'
              }`}></div>
              
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
                className="text-slate-500 hover:text-[#00b6ff] hover:bg-[#00b6ff]/5 font-medium disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>

              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-slate-400">
                   Step {currentStep + 1} of {journey.steps.length}
                 </span>
              </div>

              <Button 
                onClick={handleNext}
                className="bg-[#00b6ff] hover:bg-[#0095d1] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-[#00b6ff]/20 border-0 transition-transform active:scale-95"
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

