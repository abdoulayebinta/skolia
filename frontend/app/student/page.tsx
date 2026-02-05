"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, AlertCircle, HelpCircle } from 'lucide-react';
import { Button, Card } from '../../components/ui/shared';
import { getJourneyByCode } from '../../lib/journeys';

export default function StudentLogin() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await getJourneyByCode(code.toUpperCase());
      router.push(`/student/journey/${code.toUpperCase()}`);
    } catch (error) {
      setError("We couldn't find a journey with that code. Please check with your teacher.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Minimalist Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#00b6ff]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button 
          variant="ghost" 
          className="absolute -top-20 left-0 text-slate-400 hover:text-[#00b6ff] hover:bg-transparent p-0"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00b6ff]/10 rounded-3xl mb-6">
            <Rocket className="w-10 h-10 text-[#00b6ff]" />
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3 tracking-tight">Ready to Learn?</h1>
          <p className="text-slate-500 text-lg">Enter your class code to begin.</p>
        </div>

        <form onSubmit={handleJoin} className="w-full">
          <div className="mb-6">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="CODE"
              className="w-full bg-white border-2 border-[#00b6ff] rounded-2xl px-6 py-6 text-center text-4xl font-mono font-bold text-[#0F172A] placeholder-slate-200 focus:outline-none focus:ring-4 focus:ring-[#00b6ff]/20 transition-all tracking-widest shadow-lg shadow-[#00b6ff]/5"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-6 flex items-center justify-center p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-5 text-xl font-bold bg-[#00b6ff] hover:bg-[#0095d1] text-white shadow-xl shadow-[#00b6ff]/30 border-0 rounded-2xl transition-transform active:scale-[0.98]"
            disabled={code.length < 6 || isLoading}
            isLoading={isLoading}
          >
            Start Learning
          </Button>
          
          <div className="mt-8 text-center">
            <button 
              type="button"
              className="inline-flex items-center text-[#00b6ff] font-medium hover:underline hover:text-[#0095d1] transition-colors"
              onClick={() => alert("Ask your teacher for the 6-character code displayed on their screen.")}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Besoin d'aide ?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

