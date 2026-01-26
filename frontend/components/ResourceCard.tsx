"use client";

import React from 'react';
import { Play, BookOpen, Gamepad2, FileText, Headphones, Clock, CheckCircle } from 'lucide-react';
import { Resource, ResourceType } from '../lib/mockData';
import { Card, Badge } from './ui/shared';

interface ResourceCardProps {
  resource: Resource;
  onClick?: () => void;
  actionLabel?: string;
  isSelected?: boolean;
  showTypeIcon?: boolean;
}

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case 'video': return <Play className="w-4 h-4" />;
    case 'game': return <Gamepad2 className="w-4 h-4" />;
    case 'book': return <BookOpen className="w-4 h-4" />;
    case 'podcast': return <Headphones className="w-4 h-4" />;
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

export const ResourceCard = ({ resource, onClick, actionLabel, isSelected, showTypeIcon = true }: ResourceCardProps) => {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-blue-300'}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className={`inline-flex items-center p-1.5 rounded-md ${getTypeColor(resource.type)}`}>
            {getTypeIcon(resource.type)}
            <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide">{resource.type}</span>
          </div>
          {resource.culturalRelevance && (
            <Badge variant="success" className="ml-2">Culturally Relevant</Badge>
          )}
        </div>
        
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {resource.duration}
          </div>
          
          <div className="flex items-center">
            <span className="font-medium text-slate-600 mr-2">Grade {resource.grade}</span>
            {resource.alignmentScore && (
              <span className="flex items-center text-green-600 font-medium" title="Curriculum Alignment">
                <CheckCircle className="w-3 h-3 mr-1" />
                {resource.alignmentScore}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {actionLabel && (
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-center text-sm font-medium text-blue-600 group-hover:bg-blue-50 transition-colors">
          {actionLabel}
        </div>
      )}
    </Card>
  );
};

