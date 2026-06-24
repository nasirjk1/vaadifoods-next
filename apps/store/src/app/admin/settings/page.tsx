"use client";

import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Store <span className="text-vaadi-gold font-light">Settings</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Configure application settings and preferences</p>
        </div>
        <button className="bg-vaadi-green hover:bg-vaadi-green/90 text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center min-h-[500px]">
         <Settings className="w-16 h-16 text-slate-200 mb-6" />
         <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">Settings Configuration</h2>
         <p className="text-slate-500 text-center max-w-md">Global store configuration, payment gateways, and shipping zones can be configured here.</p>
      </div>
    </div>
  );
}
