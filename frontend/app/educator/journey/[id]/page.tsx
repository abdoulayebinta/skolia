"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, RefreshCw, Save, CheckCircle, Copy } from 'lucide-react';
import { Button, Card, Badge } from '../../../../components/ui/shared';
import { ResourceCard } from '../../../../components/ResourceCard';
import { LearningJourney, saveJourney, resourceLibrary, Resource } from '../../../../lib/mockData';

export default function JourneyPreview() {
  const params = useParams();
  const router = useRouter();
  const [journey, setJourney] = useState<LearningJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [classCode, setClassCode] = useState<string | null>(null);
  const [swappingStepIndex, setSwappingStepIndex] = useState<number | null>(null);

  useEffect(() => {
    // Retrieve the draft journey
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
    
    // Simulate API call
    setTimeout(() => {
      const code = saveJourney(journey);
      setClassCode(code);
      setDeploying(false);
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
    
    // Update local storage
    localStorage.setItem(`journey_draft_${journey.id}`, JSON.stringify(updatedJourney));
    setSwappingStepIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Journey not found</h2>
        <Button onClick={() => router.push('/educator')}>Create New Journey</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push('/educator')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="font-bold text-lg text-slate-900 line-clamp-1">{journey.title}</h1>
              <div className="flex items-center text-xs text-slate-500">
                <span className="mr-2">Grade {journey.grade}</span>
                <span>• {journey.subject}</span>
              </div>
            </div>
          </div>
          
          {!classCode && (
            <Button onClick={handleDeploy} isLoading={deploying}>
              <Share2 className="w-4 h-4 mr-2" /> Deploy to Class
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Success State - Class Code */}
        {classCode && (
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg shadow-green-500/20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Ready for Students!</h2>
              <p className="text-green-100 mb-6">Share this code with your class to start the learning journey.</p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-sm mx-auto border border-white/20">
                <div className="text-sm text-green-100 uppercase tracking-wider mb-1">Class Code</div>
                <div className="text-5xl font-mono font-bold tracking-widest mb-4">{classCode}</div>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigator.clipboard.writeText(classCode)}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          
          <div className="space-y-12">
            {journey.steps.map((step, index) => (
              <div key={index} className="relative pl-20">
                {/* Timeline Node */}
                <div className="absolute left-0 top-0 w-16 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-50 z-10 font-bold text-lg shadow-sm
                    ${index === 0 ? 'bg-blue-100 text-blue-600' : 
                      index === 1 ? 'bg-purple-100 text-purple-600' : 
                      'bg-orange-100 text-orange-600'}`}
                  >
                    {index + 1}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 rotate-90 origin-center translate-y-4 w-20 text-center">
                    {step.stepType}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{step.stepType} Phase</h3>
                    {!classCode && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-blue-600"
                        onClick={() => setSwappingStepIndex(index)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" /> Swap
                      </Button>
                    )}
                  </div>
                  <div className="p-2">
                    <ResourceCard resource={step.resource} showTypeIcon={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Swap Modal */}
      {swappingStepIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Select Replacement Resource</h3>
              <button 
                onClick={() => setSwappingStepIndex(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid gap-4">
                {resourceLibrary
                  .filter(r => r.subject === journey.subject && r.id !== journey.steps[swappingStepIndex].resource.id)
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

