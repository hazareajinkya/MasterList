'use client';

import { useState } from 'react';

export default function EmailWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully added to waitlist!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 rounded-lg p-8 text-white mt-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Get Early Access to v2</h2>
        <p className="text-lg mb-6 opacity-90">
          Sign up to be notified when v2 launches. You'll get access to enhanced probability-based matching with more detailed insights!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === 'success' ? 'text-green-200' : 'text-red-200'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

