"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Advanced <span className="text-vaadi-gold font-light">Analytics</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Deep dive into store performance</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center min-h-[500px]">
         <BarChart3 className="w-16 h-16 text-slate-200 mb-6" />
         <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Analytics Module Coming Soon</h2>
         <p className="text-slate-500 text-center max-w-md">Detailed traffic, conversion rates, and cohort analysis will be available in the next platform update.</p>
      </div>
    </div>
  );
}
