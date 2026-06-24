"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Users } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    supabase.from("customers").select("*").order("joinedAt", { ascending: false }).then(({ data }) => setCustomers(data || []));
    supabase.from("orders").select("*").then(({ data }) => setOrders(data || []));
  }, []);

  const mergedCustomers = customers.map(c => {
    // Find all orders by this customer (matching email or phone)
    const customerOrders = orders.filter(o => 
      o.shippingAddress?.email === c.email || 
      o.shippingAddress?.phone === c.phone
    );
    // Find latest order for address info
    const latestOrder = customerOrders.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    return {
      ...c,
      ordersCount: customerOrders.length,
      ordersTotalAmount: customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      country: latestOrder?.shippingAddress?.country || "India",
      state: latestOrder?.shippingAddress?.state || "-",
      city: latestOrder?.shippingAddress?.city || "-",
      address: latestOrder?.shippingAddress?.addressLines || "-",
    };
  });

  const filteredCustomers = mergedCustomers.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Customer <span className="text-vaadi-gold font-light">Profiles</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage returning buyers and user accounts</p>
        </div>
      </div>
      
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
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
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Location</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Orders</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Total Spent</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm tracking-wide">{c.fullName || 'Guest User'}</div>
                    <div className="text-slate-500 tracking-wider text-xs">{c.email}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-widest mt-0.5">{c.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600 font-bold text-xs uppercase tracking-wider">{c.city}, {c.state}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-widest">{c.country}</div>
                    <div className="text-slate-400 text-[10px] tracking-widest mt-1 w-48 truncate flex items-center" title={c.address}>{c.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center justify-center min-w-8 h-8 rounded bg-vaadi-green/5 border border-vaadi-green/10 font-bold text-vaadi-green text-xs">
                      {c.ordersCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-vaadi-green">
                    ₹{c.ordersTotalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-bold tracking-wider uppercase">
                    {c.joinedAt ? new Date(c.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No customers found matching your criteria.</p>
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
