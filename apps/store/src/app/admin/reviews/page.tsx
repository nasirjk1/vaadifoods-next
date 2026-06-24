"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Search, Trash, CheckCircle } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*, products(name)").order("created_at", { ascending: false });
    setReviews(data || []);
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Customer <span className="text-vaadi-gold font-light">Reviews</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage product reviews and ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
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
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Customer</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Rating</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Comment</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-xs tracking-wide">
                    {r.customerName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">{r.products?.name || "Unknown Product"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-vaadi-gold gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-current" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate" title={r.comment}>
                    {r.comment}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-600 rounded hover:bg-slate-100 hover:text-green-600 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                       <button className="w-8 h-8 flex items-center justify-center border border-red-100 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"><Trash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No reviews found.</p>
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
