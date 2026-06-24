"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Filter, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = () => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this order as ${status}?`)) {
      await supabase.from("orders").update({ orderStatus: status }).eq("id", id);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => 
    (statusFilter === "all" || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase()) &&
    (o.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.shippingAddress?.phone?.includes(searchTerm))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Orders <span className="text-vaadi-gold font-light">Management</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Track and fulfill customer orders</p>
        </div>
      </div>
      
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or phone..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              className="w-full sm:w-auto bg-white border border-slate-200 rounded-md py-2.5 px-4 text-sm font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-vaadi-gold uppercase tracking-widest"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Order Info</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Customer</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Items</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Payment</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded inline-block mb-1 tracking-wider uppercase">{o.id}</div>
                    <div className="text-slate-500 text-xs tracking-wider uppercase">{new Date(o.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{o.shippingAddress?.fullName || 'Guest'}</div>
                    <div className="text-slate-500 text-xs mt-0.5 tracking-wider">{o.shippingAddress?.phone}</div>
                    <div className="text-slate-400 text-[10px] uppercase tracking-widest mt-1 w-48 truncate" title={o.shippingAddress?.addressLines}>{o.shippingAddress?.addressLines}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar min-w-[150px]">
                      {o.items?.map((p: any, i: number) => (
                        <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="font-bold bg-vaadi-green/10 text-vaadi-green px-1.5 py-0.5 rounded text-[10px] leading-none shrink-0">{p.quantity}x</span>
                          <span className="truncate max-w-[150px] font-medium" title={p.product?.title || p.product?.name}>{p.product?.title || p.product?.name || 'Unknown item'}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-vaadi-green text-base">₹{o.totalAmount?.toLocaleString()}</div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">{o.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      o.orderStatus?.toLowerCase() === 'delivered' || o.orderStatus?.toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                      o.orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {o.orderStatus ? o.orderStatus : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-3 min-h-[72px]">
                    {(() => {
                      const orderId = o.id || "";
                      const customer_name = o.shippingAddress?.fullName || o.customer_name || 'Valued Customer';
                      const phone = o.shippingAddress?.phone || o.phone || '';
                      const rawStatus = o.orderStatus || o.status || o.order_status || 'Pending';
                      const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
                      const cleanPhone = phone.replace(/[^0-9]/g, "");
                      const trackUrl = `https://vaadifoods.com/track/${orderId}`;
                      const message = `Hello ${customer_name},\n\nYour order ${orderId} is now ${status}.\n\nTrack your order:\n\n${trackUrl}\n\nThank you,\nVaadi Foods`;
                      const whatsappUrl = `https://wa.me/${cleanPhone}/?text=${encodeURIComponent(message)}`;

                      return (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-50 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-md border border-emerald-200/50 hover:border-emerald-500 transition-all flex items-center justify-center shadow-sm shrink-0"
                          title="WhatsApp Customer"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.025 14.114 1 11.49 1a9.86 9.86 0 0 0-9.855 9.804c-.001 1.73.488 3.391 1.412 4.878l-.947 3.46 3.547-.93zM17.527 14.31c-.327-.164-1.94-.957-2.24-1.066-.301-.11-.521-.164-.74.164-.22.33-.85.1.066-1.042.11-.19.223-.19.55-.328.327-.137.49-.602.245-.93-.247-.327-.74-1.123-.74-1.37a1.05 1.05 0 0 0-.74-.11c-1.05.11-1.82.957-1.82 2.016 0 .548.21 1.077.584 1.45a16.65 16.65 0 0 0 4.148 4.14|1.1.55c.33.165.65.274.9.22.428-.056.883-.357 1.127-.723s.245-.733.172-.942c-.074-.11-.3-.22-.627-.384z"/>
                          </svg>
                        </a>
                      );
                    })()}
                    <select
                      className="border border-slate-200 rounded-md py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-vaadi-gold text-slate-600 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      value={o.orderStatus || 'Pending'}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No orders found matching your criteria.</p>
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
