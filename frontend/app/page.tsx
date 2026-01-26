"use client";

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        
        {/* Hero Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-sm font-medium text-slate-200">CurriculaMap: AI-Powered Learning Journeys</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 animate-fade-in-up delay-100">
          Transform Passive Content into <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Active Learning</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-200">
          Generate curriculum-aligned learning journeys in under 2 minutes with CurriculaMap. 
          Secure, culturally relevant, and designed for the modern classroom.
        </p>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-fade-in-up delay-300">
          
          {/* Educator Card */}
          <Link href="/educator" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full bg-slate-900 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800/50 transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I am an Educator</h2>
              <p className="text-slate-400 mb-6">
                Create structured lesson plans, discover resources, and deploy to your class instantly.
              </p>
              <div className="mt-auto flex items-center text-blue-400 font-medium group-hover:text-blue-300">
                Start Building <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Student Card */}
          <Link href="/student" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full bg-slate-900 border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800/50 transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I am a Student</h2>
              <p className="text-slate-400 mb-6">
                Enter your class code to access your personalized learning journey.
              </p>
              <div className="mt-auto flex items-center text-purple-400 font-medium group-hover:text-purple-300">
                Join Class <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 w-full max-w-6xl animate-fade-in-up delay-500">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Curriculum Aligned</h3>
            <p className="text-slate-400 text-sm">Every resource is vetted and mapped to specific learning outcomes.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
            <p className="text-slate-400 text-sm">No student data collection. Anonymous access via class codes.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Culturally Relevant</h3>
            <p className="text-slate-400 text-sm">Prioritizing diverse voices and local indigenous content.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

