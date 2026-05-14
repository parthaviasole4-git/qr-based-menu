'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function QRPage() {
  const [copied, setCopied] = useState(false);
  
  // Use local network IP so QR scan on same WiFi opens directly (no Ngrok warning)
  const consentUrl = 'http://172.20.10.2:3000';

  const handleCopy = () => {
    navigator.clipboard.writeText(consentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 400;
    
    img.onload = () => {
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, 400, 400);
      ctx!.drawImage(img, 0, 0, 400, 400);
      const a = document.createElement('a');
      a.download = 'restaurant-qr-code.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Scan to Get Menu
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Print or display this QR code at your restaurant
          </p>
        </div>

        {/* QR Code Card */}
        <div className="relative group w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
          <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">
            
            {/* QR Code */}
            <div id="qr-code" className="bg-white p-4 rounded-2xl shadow-lg">
              <QRCodeSVG
                value={consentUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
            
            {/* Restaurant Label */}
            <div className="text-center">
              <p className="text-white font-semibold text-lg">📋 View Our Menu</p>
              <p className="text-zinc-500 text-xs mt-1 font-mono break-all">{consentUrl}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl text-sm font-medium text-white transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-sm font-medium text-white transition-all active:scale-95 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Instruction note */}
        <p className="text-center text-xs text-zinc-600">
          Customers scan this QR code → open your consent page → tap WhatsApp to get the menu
        </p>

      </div>
    </main>
  );
}
