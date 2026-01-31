"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, RefreshCw, CheckCircle, Copy, X, Play, BookOpen, Gamepad2, FileText, Headphones, Clock, Lock, FileCheck, LayoutDashboard } from 'lucide-react';
import { Button, Card, Badge } from '../../../../components/ui/shared';
import { ResourceCard } from '../../../../components/ResourceCard';
import { LearningJourney, saveJourney, resourceLibrary, Resource, ResourceType } from '../../../../lib/mockData';

// Circular Progress Component for Confidence Score
const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = "#00b6ff" }: { percentage: number, size?: number, strokeWidth?: number, color?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-slate-700">
        <span className="text-xs font-bold">{percentage}%</span>
      </div>
    </div>
  );
};

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case 'video': return <Play className="w-4 h-4" />;
    case 'game': return <Gamepad2 className="w-4 h-4" />;
    case 'book': return <BookOpen className="w-4 h-4" />;
    case 'podcast': return <Headphones className="w-4 h-4" />;
    case 'thematic_file': return <FileText className="w-4 h-4" />;
    case 'sequence': return <FileText className="w-4 h-4" />;
    case 'guide': return <FileText className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const getTypeColor = (type: ResourceType) => {
  switch (type) {
    case 'video': return 'bg-red-100 text-red-700';
    case 'game': return 'bg-purple-100 text-purple-700';
    case 'book': return 'bg-blue-100 text-blue-700';
    case 'podcast': return 'bg-orange-100 text-orange-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default function JourneyPreview() {
  const params = useParams();
  const router = useRouter();
  const [journey, setJourney] = useState<LearningJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [classCode, setClassCode] = useState<string | null>(null);
  const [swappingStepIndex, setSwappingStepIndex] = useState<number | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`journey_draft_${params.id}`);
      if (stored) {
        setJourney(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleDeploy = () => {
    if (!journey) return;
    setDeploying(true);
    
    setTimeout(() => {
      const code = saveJourney(journey);
      setClassCode(code);
      setDeploying(false);
      setShowDeployModal(true);
    }, 1000);
  };

  const handleSwapResource = (newResource: Resource) => {
    if (!journey || swappingStepIndex === null) return;
    
    const newSteps = [...journey.steps];
    newSteps[swappingStepIndex] = {
      ...newSteps[swappingStepIndex],
      resource: newResource
    };
    
    const updatedJourney = { ...journey, steps: newSteps };
    setJourney(updatedJourney);
    localStorage.setItem(`journey_draft_${journey.id}`, JSON.stringify(updatedJourney));
    setSwappingStepIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b6ff]"></div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Journey not found</h2>
        <Button onClick={() => router.push('/educator')}>Create New Journey</Button>
      </div>
    );
  }

  // Calculate average alignment score
  const avgScore = Math.round(journey.steps.reduce((acc, step) => acc + (step.resource.alignmentScore || 0), 0) / journey.steps.length);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/educator')} className="text-slate-500 hover:text-[#0F172A]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-xl text-[#0F172A] line-clamp-1">{journey.title}</h1>
              <div className="flex items-center text-sm text-slate-500 mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium mr-2">Grade {journey.grade}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{journey.subject}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-slate-100">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Confidence</div>
                <div className="text-sm font-bold text-slate-700">Curriculum Aligned</div>
              </div>
              <CircularProgress percentage={avgScore} size={48} color="#10b981" />
            </div>

            <Button 
              onClick={handleDeploy} 
              isLoading={deploying}
              className="bg-[#00b6ff] hover:bg-[#0095d1] text-white shadow-lg shadow-[#00b6ff]/20 border-0 px-6 py-2.5 h-auto text-base font-semibold rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" /> Deploy Journey
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Teacher Dashboard Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center mb-4 text-[#0F172A]">
              <LayoutDashboard className="w-5 h-5 mr-2 text-[#00b6ff]" />
              <h2 className="font-bold text-lg">Teacher Dashboard</h2>
            </div>
            
            {journey.teacherTool ? (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2">
                  <Lock className="w-4 h-4 text-[#00b6ff]" />
                </div>
                
                <div className="flex items-start mb-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 mr-3">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pedagogical Tool</div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{journey.teacherTool.title}</h3>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 mb-3 line-clamp-4">
                  {journey.teacherTool.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-xs font-medium text-slate-400">{journey.teacherTool.duration}</span>
                  <span className="text-xs font-bold text-[#00b6ff] flex items-center">
                    Teacher Only
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic text-center py-4">
                No specific teacher tool found for this journey.
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Journey Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#00b6ff]">{journey.steps.length}</div>
                  <div className="text-xs text-slate-500">Resources</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#00b6ff]">~45m</div>
                  <div className="text-xs text-slate-500">Duration</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Timeline */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-bold text-xl text-[#0F172A]">Student Timeline</h2>
            <div className="text-sm text-slate-500">
              <span className="font-bold text-[#00b6ff]">{journey.steps.length}</span> deployable assets
            </div>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-slate-200 lg:hidden"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 hidden lg:block z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {journey.steps.map((step, index) => (
                <div key={index} className="flex flex-row lg:flex-col gap-6 lg:gap-0 group">
                  {/* Step Indicator */}
                  <div className="flex-shrink-0 flex lg:items-center lg:justify-center lg:mb-6 relative">
                    <div className={`w-16 h-16 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-4 border-[#F8FAFC] shadow-md z-10 font-bold text-lg
                      ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                        index === 1 ? 'bg-purple-100 text-purple-600' : 
                        'bg-orange-100 text-orange-600'}`}
                    >
                      {index + 1}
                    </div>
                    <div className="absolute left-20 top-4 lg:left-auto lg:top-auto lg:-bottom-8 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                      {step.stepType}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 lg:mt-8 relative">
                    <div className="bg-white rounded-2xl border-2 border-[#00b6ff]/20 shadow-sm hover:shadow-xl hover:border-[#00b6ff] transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
                      {/* Thumbnail Placeholder */}
                      <div className="h-32 lg:h-40 bg-slate-100 relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-10 ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {getTypeIcon(step.resource.type)}
                        </div>
                        
                        {/* Swap Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
                          <Button 
                            onClick={() => setSwappingStepIndex(index)}
                            className="bg-white text-[#0F172A] hover:bg-slate-100 border-0 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200"
                            size="sm"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" /> Swap Resource
                          </Button>
                        </div>

                        <div className="absolute top-3 right-3">
                           <Badge variant="default" className="bg-white/90 backdrop-blur shadow-sm text-slate-700 border border-slate-100">
                             {step.resource.duration}
                           </Badge>
                        </div>
                        
                        <div className="absolute bottom-3 left-3">
                           <div className="bg-[#00b6ff] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                             <CheckCircle className="w-3 h-3 mr-1" /> Deployable
                           </div>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getTypeColor(step.resource.type)}`}>
                            {getTypeIcon(step.resource.type)}
                            <span className="ml-1.5">{step.resource.type}</span>
                          </div>
                          {step.resource.alignmentScore && (
                            <div className="flex items-center text-emerald-600 text-xs font-bold" title="Alignment Score">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {step.resource.alignmentScore}%
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-[#0F172A] mb-2 line-clamp-2 group-hover:text-[#00b6ff] transition-colors">
                          {step.resource.title}
                        </h3>
                        
                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                          {step.resource.description}
                        </p>

                        {step.resource.culturalRelevance && (
                          <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="flex items-center text-xs font-medium text-[#00b6ff] bg-[#00b6ff]/10 px-2 py-1 rounded-md w-fit">
                              <span className="mr-1">✨</span> Culturally Relevant
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && classCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#00b6ff]"></div>
            <button 
              onClick={() => setShowDeployModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Journey Deployed!</h2>
              <p className="text-slate-500 mb-8">
                Your learning journey is ready. Share this code with your students to get started.
              </p>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 mb-6 relative group">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Class Code</div>
                <div className="text-5xl font-mono font-bold text-[#0F172A] tracking-widest">{classCode}</div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl cursor-pointer"
                     onClick={() => navigator.clipboard.writeText(classCode)}>
                  <span className="font-bold text-[#00b6ff] flex items-center">
                    <Copy className="w-5 h-5 mr-2" /> Click to Copy
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-[#00b6ff] hover:bg-[#0095d1] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#00b6ff]/20"
                onClick={() => setShowDeployModal(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Resource Modal */}
      {swappingStepIndex !== null && journey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Select Replacement Resource</h3>
              <button 
                onClick={() => setSwappingStepIndex(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid gap-4">
                {resourceLibrary
                  .filter(r => r.subject === journey.subject && r.id !== journey.steps[swappingStepIndex].resource.id && r.audience === 'Student')
                  .map(resource => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      onClick={() => handleSwapResource(resource)}
                      actionLabel="Select this resource"
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

