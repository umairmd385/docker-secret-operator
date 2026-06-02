'use client';
import { XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewsletterUnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 selection:bg-accent/30 text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="absolute w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center relative z-10 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner shadow-rose-500/20">
          <XCircle className="w-10 h-10 text-rose-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Unsubscribed</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          You have been successfully removed from our newsletter list. You will no longer receive any updates from Docker Secret Operator.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-white/5 text-white hover:bg-white/10 border border-white/10 font-bold rounded-xl transition-all group"
        >
          Return to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
