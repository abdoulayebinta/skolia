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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button 
          variant="ghost" 
          className="text-slate-400 hover:text-white mb-8"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-lg shadow-purple-500/30 mb-6 transform rotate-3">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Ready to Learn?</h1>
          <p className="text-slate-400">Enter the code from your teacher to start.</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleJoin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">
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
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="mb-6 flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 border-0"
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

