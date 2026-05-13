"use client";

import { useState } from "react";

export default function Home() {
  const [consent, setConsent] = useState(true);

  // If consent is true, the message includes "yes", which the webhook detects to save to the database.
  const message = consent ? "Hi yes, I want the menu" : "Hi, I want the menu";
  const waLink = `https://wa.me/14155238886?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-col w-full max-w-md items-center justify-center p-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl">
        <div className="w-20 h-20 mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600 dark:text-green-400"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-center text-zinc-900 dark:text-zinc-50 mb-4">
          Get Menu on WhatsApp
        </h1>
        
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          Click the button below to message us on WhatsApp and instantly receive our interactive digital menu.
        </p>

        <div className="flex items-center justify-between w-full p-4 mb-8 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
          <div className="flex flex-col pr-4">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Future Offers & Updates</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">I agree to receive promotional messages and review requests.</span>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <div className="w-14 h-7 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-zinc-600 peer-checked:bg-[#25D366]"></div>
          </label>
        </div>

        <a
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 text-white font-semibold text-lg transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/30"
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open WhatsApp
        </a>
      </main>
    </div>
  );
}
