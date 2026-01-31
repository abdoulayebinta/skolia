"use client";

import React from 'react';
import { X, RefreshCw, Play, BookOpen, Gamepad2, FileText, Headphones, CheckCircle, Info } from 'lucide-react';
import { Button, Badge } from './ui/shared';
import { Resource, ResourceType } from '../lib/mockData';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwap?: () => void;
  resource: Resource | null;
}

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case 'video': return <Play className="w-5 h-5" />;
    case 'game': return <Gamepad2 className="w-5 h-5" />;
    case 'book': return <BookOpen className="w-5 h-5" />;
    case 'podcast': return <Headphones className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
};

export const ResourceModal = ({ isOpen, onClose, onSwap, resource }: ResourceModalProps) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-[#00b6ff]/10 rounded-lg text-[#00b6ff]">
              {getTypeIcon(resource.type)}
            </div>
            <div className="flex flex-col">
               <h3 className="font-bold text-lg text-[#0F172A] line-clamp-1">{resource.title}</h3>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-[#00b6ff] uppercase tracking-wider">{resource.type.replace('_', ' ')}</span>
                 <span className="text-slate-300">•</span>
                 <span className="text-xs text-slate-500">{resource.duration}</span>
               </div>
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
        <div className="p-6 overflow-y-auto">
          {/* Media Container (16:9) */}
          <div className="aspect-video w-full bg-slate-900 rounded-xl mb-8 relative overflow-hidden group flex items-center justify-center shadow-inner">
             {/* Placeholder for actual media */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950"></div>
             
             {/* Play/Preview Icon */}
             <div className="relative z-10 text-center p-6">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  {getTypeIcon(resource.type)}
                </div>
                <p className="text-white/80 text-sm font-medium">Preview Content</p>
             </div>
          </div>

          {/* Learning Objectives / Description */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2 text-[#00b6ff]" />
                Learning Objectives & Description
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {resource.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-between items-end">
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resource.alignmentScore && (
                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                   <CheckCircle className="w-5 h-5" />
                   <span className="text-sm font-bold">{resource.alignmentScore}% Curriculum Alignment</span>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-4">
          {onSwap && (
            <Button 
              variant="outline" 
              onClick={() => {
                onSwap();
                onClose();
              }}
              className="border-2 border-[#00b6ff] text-[#00b6ff] hover:bg-[#00b6ff]/5 font-semibold bg-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Swap Resource
            </Button>
          )}
          <Button 
            onClick={onClose}
            className="bg-[#00b6ff] hover:bg-[#0095d1] text-white ml-auto px-8 font-bold shadow-lg shadow-[#00b6ff]/20"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

