"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui/shared';
import { getJourneyByCode } from '../../lib/mockData';

export default function StudentLogin() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network check
    setTimeout(() => {
      const journey = getJourneyByCode(code.toUpperCase());
      
      if (journey) {
        router.push(`/student/journey/${code.toUpperCase()}`);
      } else {
        setError("We couldn't find a journey with that code. Please check with your teacher.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00b6ff]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button 
          variant="ghost" 
          className="text-slate-500 hover:text-[#0F172A] mb-8"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00b6ff] rounded-3xl shadow-lg shadow-[#00b6ff]/30 mb-6 transform rotate-3">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Ready to Learn?</h1>
          <p className="text-slate-500">Enter the code from your teacher to start.</p>
        </div>

        <Card className="bg-white border border-slate-200 p-8 shadow-xl">
          <form onSubmit={handleJoin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
                Class Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="XYZ-123"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-4 text-center text-3xl font-mono font-bold text-[#0F172A] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00b6ff] focus:border-transparent transition-all tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="mb-6 flex items-center p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 text-lg bg-[#00b6ff] hover:bg-[#0095d1] text-white shadow-lg shadow-[#00b6ff]/20 border-0"
              disabled={code.length < 6 || isLoading}
              isLoading={isLoading}
            >
              Start Adventure
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

