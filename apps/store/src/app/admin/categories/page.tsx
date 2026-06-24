"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FolderTree, Search, Plus, Edit, Trash } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Product <span className="text-vaadi-gold font-light">Categories</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage product classification and hierarchy</p>
        </div>
        <button className="bg-vaadi-green hover:bg-vaadi-green/90 text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Slug</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Products</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm tracking-wide">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-bold font-mono tracking-widest">-</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-green-200 bg-green-50 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-600 rounded hover:bg-slate-100 hover:text-vaadi-green transition-colors"><Edit className="w-4 h-4" /></button>
                       <button className="w-8 h-8 flex items-center justify-center border border-red-100 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"><Trash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <FolderTree className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No categories found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
