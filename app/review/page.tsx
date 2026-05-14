'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ReviewForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, rating, comment })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-center max-w-md w-full mx-auto animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center border border-green-500/30">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
        <p className="text-white/70">Your review means the world to us. We hope to see you again soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Decorative background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <form onSubmit={handleSubmit} className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">How was your experience?</h1>
          <p className="text-sm text-zinc-400">We constantly strive to improve. Let us know how we did!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <svg 
                className={`w-12 h-12 transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-zinc-600'}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">Share more details (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you love? What could be better?"
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-purple-500/30">
      <Suspense fallback={
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      }>
        <ReviewForm />
      </Suspense>
    </main>
  );
}
