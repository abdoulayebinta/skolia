"use client";

import React, { useState, useEffect } from 'react';
import { X, Wand2, Check, Users, ArrowRight, BookOpen, Languages, Gauge, FileText, Loader2, ChevronRight, Split, BrainCircuit, Sparkles } from 'lucide-react';
import { Button, Badge } from './ui/shared';
import { Resource } from '../lib/mockData';

interface DifferentiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

type Level = 'simplified' | 'standard' | 'advanced' | 'esl';

const MOCK_CONTENT = {
  standard: {
    text: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. It takes place inside plant cells in small things called chloroplasts.",
    readingLevel: "Grade 5",
    scaffolding: "Standard definitions"
  },
  simplified: {
    text: "Plants make their own food using sunlight! This is called photosynthesis. They need three things: 1. Sunlight ☀️ 2. Water 💧 3. Air (Carbon Dioxide) 💨. They mix these to make sugar for food and give us oxygen to breathe.",
    readingLevel: "Grade 3",
    scaffolding: "Visual emojis, bullet points, simple sentence structure"
  },
  advanced: {
    text: "Photosynthesis is a complex biochemical process involving two main stages: light-dependent reactions and the Calvin cycle. Chlorophyll pigments within the chloroplasts absorb light energy, which is then transduced into chemical energy (ATP and NADPH) to synthesize glucose from carbon dioxide.",
    readingLevel: "Grade 7+",
    scaffolding: "Scientific terminology, detailed process description"
  },
  esl: {
    text: "Plants need food to grow. \n\nSun + Water + Air = Food.\n\nThis process is named: Pho-to-syn-the-sis.\n\nKey Words:\n- Sun (Soleil)\n- Water (Eau)\n- Grow (Grandir)",
    readingLevel: "Beginner English",
    scaffolding: "Bilingual support (FR/EN), simplified syntax, key vocabulary focus"
  }
};

export const DifferentiationModal = ({ isOpen, onClose, resource }: DifferentiationModalProps) => {
  const [level, setLevel] = useState<Level>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLevel('standard');
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleLevelChange = (newLevel: Level) => {
    if (newLevel === level) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setLevel(newLevel);
      setIsGenerating(false);
    }, 800);
  };

  const handleAssign = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00b6ff]/10 rounded-lg text-[#00b6ff]">
              <Split className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-bold text-lg text-[#0F172A]">Differentiation Engine</h3>
               <p className="text-xs text-slate-500">Adapting: <span className="font-medium text-[#00b6ff]">{resource.title}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar Controls */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Difficulty Level</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => handleLevelChange('simplified')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${level === 'simplified' ? 'bg-white border-[#00b6ff] text-[#00b6ff] shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4" /> Simplified
                  </div>
                  {level === 'simplified' && <Check className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleLevelChange('standard')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${level === 'standard' ? 'bg-white border-[#00b6ff] text-[#00b6ff] shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Standard
                  </div>
                  {level === 'standard' && <Check className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleLevelChange('advanced')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${level === 'advanced' ? 'bg-white border-[#00b6ff] text-[#00b6ff] shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Advanced
                  </div>
                  {level === 'advanced' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Adaptations</h4>
              <button 
                onClick={() => handleLevelChange('esl')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${level === 'esl' ? 'bg-white border-[#00b6ff] text-[#00b6ff] shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4" /> ESL / ELL Support
                </div>
                {level === 'esl' && <Check className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-[#00b6ff] font-bold text-xs mb-2">
                  <Wand2 className="w-3 h-3" /> AI Assistant
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our AI analyzes the resource transcript and regenerates content to match the selected reading level and learning needs.
                </p>
              </div>
            </div>
          </div>

          {/* Content Comparison */}
          <div className="flex-1 p-6 md:p-8 bg-slate-50/50 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6 h-full">
              
              {/* Original Version */}
              <div className="flex flex-col h-full">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="default" className="bg-slate-200 text-slate-700">Original Source</Badge>
                  <span className="text-xs text-slate-400 font-medium">Grade 5 Level</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-[#0F172A] mb-4 text-lg">{resource.title}</h4>
                  <p>{MOCK_CONTENT.standard.text}</p>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Key Concepts</h5>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Adapted Version */}
              <div className="flex flex-col h-full relative">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="info" className="bg-[#00b6ff] text-white border-0">
                    {isGenerating ? 'Generating...' : 'AI Adapted Version'}
                  </Badge>
                  {!isGenerating && (
                    <span className="text-xs text-[#00b6ff] font-medium">{MOCK_CONTENT[level].readingLevel}</span>
                  )}
                </div>
                
                <div className={`bg-white p-6 rounded-2xl border-2 border-[#00b6ff]/20 shadow-lg shadow-[#00b6ff]/5 flex-1 relative transition-all duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#00b6ff] animate-spin mb-2" />
                        <span className="text-sm font-medium text-[#00b6ff]">Adapting content...</span>
                      </div>
                    </div>
                  )}
                  
                  <h4 className="font-bold text-[#0F172A] mb-4 text-lg flex items-center gap-2">
                    {resource.title} 
                    <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                      {level === 'esl' ? 'ESL' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </h4>
                  
                  <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {MOCK_CONTENT[level].text}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h5 className="text-xs font-bold text-[#00b6ff] uppercase mb-2 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" /> Scaffolding Added
                    </h5>
                    <p className="text-xs text-slate-500 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      {MOCK_CONTENT[level].scaffolding}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>Assign to:</span>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-[#00b6ff]">
              <option>Whole Class</option>
              <option>Group A (Advanced)</option>
              <option>Group B (Support)</option>
              <option>Individual Students...</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleAssign}
              className={`px-6 transition-all duration-300 ${showSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-[#00b6ff] hover:bg-[#0095d1]'} text-white shadow-lg`}
              disabled={isGenerating}
            >
              {showSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Assigned!
                </>
              ) : (
                <>
                  Assign Version <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

