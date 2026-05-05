import Image from "next/image";

export default function Home() {
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

        {/* Change YOUR_NUMBER to your actual WhatsApp sandbox or business number */}
        <a
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 text-white font-semibold text-lg transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/30"
          href="https://wa.me/14155238886?text=Hi%20I%20want%20the%20menu"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open WhatsApp
        </a>
      </main>
    </div>
  );
}
