"use client";

import { useState } from "react";
import { Search, Save, Globe } from "lucide-react";

export default function SEOPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">SEO <span className="text-vaadi-gold font-light">Management</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage global search engine optimization settings</p>
        </div>
        <button disabled={loading} className="bg-vaadi-green hover:bg-vaadi-green/90 text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-vaadi-green">
            <Globe className="w-5 h-5" />
            <h2 className="font-serif font-bold text-lg">Global Metadata</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Site Title</label>
              <input type="text" defaultValue="Vaadi Foods | Premium Kashmiri Dry Fruits & Saffron" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold" />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Meta Description</label>
              <textarea rows={3} defaultValue="Discover premium Kashmiri dry fruits, saffron, and traditional health mixes at Vaadi Foods. 100% authentic, handpicked quality for a healthy lifestyle." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold"></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Keywords</label>
              <input type="text" defaultValue="kashmiri dry fruits, pure saffron, makhana, healthy snacking, premium nuts" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-vaadi-green">
            <Search className="w-5 h-5" />
            <h2 className="font-serif font-bold text-lg">Indexing & Sitemaps</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md bg-slate-50">
               <div>
                 <div className="font-bold text-sm text-slate-800">Generate Sitemap</div>
                 <div className="text-xs text-slate-500 mt-0.5">Create sitemap.xml for Google Search Console</div>
               </div>
               <button className="px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-vaadi-green transition-colors">Generate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
