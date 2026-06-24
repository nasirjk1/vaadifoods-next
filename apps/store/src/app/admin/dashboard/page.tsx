"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingCart, DollarSign, ArrowUpRight, TrendingUp, Users, AlertTriangle, TrendingDown } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    supabase.from("products").select("*").then(({ data }) => setProducts(data || []));
    supabase.from("customers").select("*", { count: 'exact', head: true }).then(({ count }) => setCustomersCount(count || 0));
  }, []);
  
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter(o => o.orderStatus?.toLowerCase() === 'completed' || o.orderStatus?.toLowerCase() === 'delivered').length;
  const pendingOrders = orders.filter(o => o.orderStatus?.toLowerCase() === 'pending' || o.orderStatus?.toLowerCase() === 'processing').length;

  const lowStockProducts = products.filter(p => (p.qtyInStock || 0) < 10);
  
  // Chart Data preparation
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayOrders = orders.filter(o => o.created_at?.startsWith(date));
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orders: dayOrders.length
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Dashboard <span className="text-vaadi-gold font-light">Overview</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Welcome back, Administrator</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight">₹{totalRevenue.toLocaleString()}</div>
          <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> All-time earnings
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <ShoppingCart className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-4">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight">{orders.length}</div>
          <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {pendingOrders} pending • {completedOrders} completed
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Users className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Customers</div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight">{customersCount}</div>
          <Link href="/admin/customers" className="mt-4 text-[10px] font-bold uppercase tracking-widest text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
            View directory <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="p-6 bg-white rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Package className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 bg-vaadi-green/5 text-vaadi-green rounded flex items-center justify-center mb-4">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Active Products</div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight">{products.length}</div>
          <Link href="/admin/products" className="mt-4 text-[10px] font-bold uppercase tracking-widest text-vaadi-green hover:text-vaadi-gold flex items-center gap-1 transition-colors">
            Manage inventory <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm">
          <h2 className="font-serif font-bold text-xl text-vaadi-green mb-6">Revenue Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip cursor={{stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm">
          <h2 className="font-serif font-bold text-xl text-vaadi-green mb-6">Orders Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} allowDecimals={false} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="orders" fill="#D9901A" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-vaadi-green">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-vaadi-gold hover:text-vaadi-green">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Order ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Customer</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Amount</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 7).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 text-xs">{o.id.split('-')[0].toUpperCase()}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{o.shippingAddress?.fullName || 'Guest'}</td>
                    <td className="px-6 py-4 font-bold text-vaadi-green">₹{o.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        o.orderStatus?.toLowerCase() === 'completed' || o.orderStatus?.toLowerCase() === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        o.orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {o.orderStatus ? o.orderStatus : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">{new Date(o.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-md border border-red-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="font-serif font-bold text-lg">Inventory Alerts</h2>
              </div>
              <span className="bg-white text-red-700 text-[10px] border border-red-200 uppercase tracking-widest font-bold px-2 py-1 rounded shadow-sm">{lowStockProducts.length}</span>
            </div>
            <div className="p-0 max-h-[350px] overflow-y-auto custom-scrollbar">
              <ul className="divide-y divide-slate-100">
                {lowStockProducts.slice(0, 5).map(p => (
                  <li key={p.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate" title={p.name}>{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.sku || p.id}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">{p.qtyInStock || 0} left</span>
                    </div>
                  </li>
                ))}
                {lowStockProducts.length === 0 && (
                  <li className="p-8 text-center text-slate-400 text-sm font-medium">
                    All products are well stocked.
                  </li>
                )}
              </ul>
              {lowStockProducts.length > 5 && (
                <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                  <Link href="/admin/products" className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-700">View all alerts</Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
