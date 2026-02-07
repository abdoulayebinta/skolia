'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/shared';

export default function DebugPage() {
  const router = useRouter();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const educatorData = localStorage.getItem('educator_data');

    if (token) {
      try {
        // Decode token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        const payload = JSON.parse(jsonPayload);

        const now = Date.now();
        const exp = payload.exp * 1000;
        const isExpired = now >= exp;

        setTokenInfo({
          hasToken: true,
          payload,
          expiresAt: new Date(exp).toLocaleString(),
          isExpired,
          timeUntilExpiry: isExpired
            ? 'EXPIRED'
            : `${Math.floor((exp - now) / 1000 / 60)} minutes`,
          educatorData: educatorData ? JSON.parse(educatorData) : null,
        });
      } catch (error) {
        setTokenInfo({
          hasToken: true,
          error: 'Failed to decode token',
          rawToken: token.substring(0, 50) + '...',
        });
      }
    } else {
      setTokenInfo({
        hasToken: false,
      });
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    alert('LocalStorage cleared! Redirecting to home...');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug: Auth Token Status</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Token Information</h2>
          <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={clearStorage}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Clear LocalStorage & Go Home
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go to Home
          </Button>
          <Button
            onClick={() => router.push('/educator')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Go to Educator
          </Button>
        </div>
      </div>
    </div>
  );
}
