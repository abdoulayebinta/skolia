'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  RefreshCw,
  CheckCircle,
  Copy,
  X,
  Play,
  BookOpen,
  Gamepad2,
  FileText,
  Headphones,
  Clock,
  Lock,
  LayoutDashboard,
  Eye,
} from 'lucide-react';
import { Button, Badge } from '../../../../components/ui/shared';
import { ResourceCard } from '../../../../components/ResourceCard';
import { ResourceModal } from '../../../../components/ResourceModal';
import {
  Journey,
  Resource,
  getJourney,
  updateJourney,
  deployJourney,
} from '../../../../lib/journeys';
import {
  Resource as MockResource,
  resourceLibrary,
} from '../../../../lib/mockData';

// Circular Progress Component for Confidence Score
const CircularProgress = ({
  percentage,
  size = 60,
  strokeWidth = 4,
  color = '#00b6ff',
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="w-4 h-4" />;
    case 'game':
      return <Gamepad2 className="w-4 h-4" />;
    case 'book':
      return <BookOpen className="w-4 h-4" />;
    case 'podcast':
      return <Headphones className="w-4 h-4" />;
    case 'thematic_file':
      return <FileText className="w-4 h-4" />;
    case 'sequence':
      return <FileText className="w-4 h-4" />;
    case 'guide':
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'video':
      return 'bg-red-100 text-red-700';
    case 'game':
      return 'bg-purple-100 text-purple-700';
    case 'book':
      return 'bg-blue-100 text-blue-700';
    case 'podcast':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default function JourneyPreview() {
  const params = useParams();
  const router = useRouter();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [classCode, setClassCode] = useState<string | null>(null);
  const [swappingStepIndex, setSwappingStepIndex] = useState<number | null>(
    null,
  );
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [previewStepIndex, setPreviewStepIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourney = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedJourney = await getJourney(params.id as string);
        setJourney(fetchedJourney);
        setClassCode(fetchedJourney.class_code || null);
      } catch (err) {
        console.error('Failed to fetch journey:', err);
        setError(err instanceof Error ? err.message : 'Failed to load journey');
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, [params.id]);

  const handleDeploy = async () => {
    if (!journey) return;
    setDeploying(true);

    try {
      const code = await deployJourney(journey.id);
      setClassCode(code);
      setShowDeployModal(true);
    } catch (err) {
      console.error('Failed to deploy journey:', err);
      alert('Failed to deploy journey. Please try again.');
    } finally {
      setDeploying(false);
    }
  };

  const handleSwapResource = async (newResource: MockResource) => {
    if (!journey || swappingStepIndex === null) return;

    try {
      // Convert MockResource to Resource format for the API
      const apiResource: Resource = {
        id: newResource.id,
        title: newResource.title,
        description: newResource.description,
        type: newResource.type,
        audience: newResource.audience,
        duration: newResource.duration,
        subject: newResource.subject,
        grade: newResource.grade,
        tags: newResource.tags,
        thumbnail: newResource.thumbnail,
        content_url: newResource.contentUrl,
        alignment_score: newResource.alignmentScore,
        cultural_relevance: newResource.culturalRelevance || false,
      };

      const newSteps = [...journey.steps];
      newSteps[swappingStepIndex] = {
        ...newSteps[swappingStepIndex],
        resource: apiResource,
      };

      const updatedJourney = await updateJourney(journey.id, {
        steps: newSteps.map((step) => ({
          step_type: step.step_type,
          resource_id: step.resource.id,
        })),
      });

      setJourney(updatedJourney);
      setSwappingStepIndex(null);
    } catch (err) {
      console.error('Failed to swap resource:', err);
      alert('Failed to swap resource. Please try again.');
    }
  };

  const openPreview = (resource: Resource, index: number) => {
    setPreviewResource(resource);
    setPreviewStepIndex(index);
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
        <h2 className="text-xl font-bold text-[#0F172A] mb-4">
          {error || 'Journey not found'}
        </h2>
        <Button onClick={() => router.push('/educator')}>
          Create New Journey
        </Button>
      </div>
    );
  }

  // Calculate average alignment score
  const avgScore = Math.round(
    journey.steps.reduce(
      (acc, step) => acc + (step.resource.alignment_score || 0),
      0,
    ) / journey.steps.length,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/educator')}
              className="text-slate-500 hover:text-[#0F172A]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-xl text-[#0F172A] line-clamp-1">
                {journey.title}
              </h1>
              <div className="flex items-center text-sm text-slate-500 mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium mr-2">
                  Grade {journey.grade}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                  {journey.subject}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-slate-100">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Confidence
                </div>
                <div className="text-sm font-bold text-slate-700">
                  Curriculum Aligned
                </div>
              </div>
              <CircularProgress
                percentage={avgScore}
                size={48}
                color="#10b981"
              />
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-bold text-2xl text-[#0F172A]">Journey Map</h2>

          {/* Stats Box */}
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#00b6ff]/10 rounded-lg">
                <LayoutDashboard className="w-4 h-4 text-[#00b6ff]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Resources
                </span>
                <span className="text-sm font-bold text-[#0F172A] leading-none">
                  {journey.steps.length} Items
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#00b6ff]/10 rounded-lg">
                <Clock className="w-4 h-4 text-[#00b6ff]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Duration
                </span>
                <span className="text-sm font-bold text-[#0F172A] leading-none">
                  ~45 min
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-slate-200 lg:hidden"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 hidden lg:block z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {journey.steps.map((step, index) => {
              const isTeacherResource = step.resource.audience === 'Teacher';

              return (
                <div
                  key={index}
                  className="flex flex-row lg:flex-col gap-6 lg:gap-0 group"
                >
                  {/* Step Indicator */}
                  <div className="flex-shrink-0 flex lg:items-center lg:justify-center lg:mb-6 relative">
                    <div
                      className={`w-16 h-16 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-4 shadow-md z-10 font-bold text-lg
                      ${
                        isTeacherResource
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-[#00b6ff] text-white border-[#F8FAFC]'
                      }`}
                    >
                      {isTeacherResource ? (
                        <Lock className="w-5 h-5 lg:w-4 lg:h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="absolute left-20 top-4 lg:left-auto lg:top-auto lg:-bottom-8 text-sm font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                      {step.step_type}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 lg:mt-8 relative">
                    <div
                      className={`rounded-2xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1
                        ${
                          isTeacherResource
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            : 'bg-white border-[#00b6ff]/20 hover:border-[#00b6ff]'
                        }`}
                    >
                      {/* Thumbnail Placeholder */}
                      <div
                        className={`h-32 lg:h-40 relative overflow-hidden ${isTeacherResource ? 'bg-slate-200' : 'bg-slate-100'}`}
                      >
                        <div
                          className={`absolute inset-0 opacity-10 ${
                            isTeacherResource
                              ? 'bg-slate-500'
                              : index % 3 === 0
                                ? 'bg-blue-500'
                                : index % 3 === 1
                                  ? 'bg-purple-500'
                                  : 'bg-orange-500'
                          }`}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                          {getTypeIcon(step.resource.type)}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm gap-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openPreview(step.resource, index);
                            }}
                            className="bg-white/20 text-white hover:bg-white/30 border border-white/50 backdrop-blur-md"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" /> Preview
                          </Button>

                          {!isTeacherResource && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSwappingStepIndex(index);
                              }}
                              className="bg-white text-[#0F172A] hover:bg-slate-100 border-0 shadow-lg"
                              size="sm"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" /> Swap
                            </Button>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <Badge
                            variant="default"
                            className="bg-white/90 backdrop-blur shadow-sm text-slate-700 border border-slate-100"
                          >
                            {step.resource.duration}
                          </Badge>
                        </div>

                        <div className="absolute bottom-3 left-3">
                          {isTeacherResource ? (
                            <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                              <Lock className="w-3 h-3 mr-1" /> Teacher Only
                            </div>
                          ) : (
                            <div className="bg-[#00b6ff] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />{' '}
                              Deployable
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide
                            ${isTeacherResource ? 'bg-slate-200 text-slate-600' : getTypeColor(step.resource.type)}`}
                          >
                            {getTypeIcon(step.resource.type)}
                            <span className="ml-1.5">
                              {step.resource.type.replace('_', ' ')}
                            </span>
                          </div>
                          {step.resource.alignment_score && (
                            <div
                              className="flex items-center text-emerald-600 text-xs font-bold"
                              title="Alignment Score"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {step.resource.alignment_score}%
                            </div>
                          )}
                        </div>

                        <h3
                          className={`font-bold text-lg mb-2 line-clamp-2 transition-colors ${isTeacherResource ? 'text-slate-700' : 'text-[#0F172A] group-hover:text-[#00b6ff]'}`}
                        >
                          {step.resource.title}
                        </h3>

                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                          {step.resource.description}
                        </p>

                        {step.resource.cultural_relevance && (
                          <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="flex items-center text-xs font-medium text-[#00b6ff] bg-[#00b6ff]/10 px-2 py-1 rounded-md w-fit">
                              <span className="mr-1">✨</span> Culturally
                              Relevant
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Resource Preview Modal */}
      {previewResource && (
        <ResourceModal
          isOpen={true}
          onClose={() => {
            setPreviewResource(null);
            setPreviewStepIndex(null);
          }}
          resource={{
            id: previewResource.id,
            title: previewResource.title,
            description: previewResource.description,
            type: previewResource.type as MockResource['type'],
            audience: previewResource.audience as MockResource['audience'],
            duration: previewResource.duration,
            subject: previewResource.subject as MockResource['subject'],
            grade: previewResource.grade,
            tags: previewResource.tags || [],
            thumbnail: previewResource.thumbnail,
            contentUrl: previewResource.content_url,
            alignmentScore: previewResource.alignment_score,
            culturalRelevance: previewResource.cultural_relevance,
          }}
          onSwap={
            previewStepIndex !== null && previewResource.audience === 'Student'
              ? () => {
                  setSwappingStepIndex(previewStepIndex);
                  setPreviewResource(null);
                  setPreviewStepIndex(null);
                }
              : undefined
          }
        />
      )}

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

              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                Journey Deployed!
              </h2>
              <p className="text-slate-500 mb-8">
                Your learning journey is ready. Share this code with your
                students to get started.
              </p>

              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 mb-6 relative group">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Class Code
                </div>
                <div className="text-5xl font-mono font-bold text-[#0F172A] tracking-widest">
                  {classCode}
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(classCode)}
                >
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
              <h3 className="text-xl font-bold text-[#0F172A]">
                Select Replacement Resource
              </h3>
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
                  .filter(
                    (r) =>
                      r.subject === journey.subject &&
                      r.id !== journey.steps[swappingStepIndex].resource.id &&
                      r.audience === 'Student',
                  )
                  .map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onClick={() => handleSwapResource(resource)}
                      actionLabel="Select this resource"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
