"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Check, Clock, X } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = () => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r text-sm">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg">Vaadi Admin</div>
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/" className="px-4 py-2 hover:bg-gray-50 rounded-md text-gray-600">Dashboard</Link>
          <Link href="/products" className="px-4 py-2 hover:bg-gray-50 rounded-md text-gray-600">Products</Link>
          <Link href="/orders" className="px-4 py-2 bg-gray-100 rounded-md font-medium text-black">Orders</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        
        <div className="bg-white rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">ID / Date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Customer Details</th>
                <th className="px-6 py-3 font-medium text-gray-500">Items</th>
                <th className="px-6 py-3 font-medium text-gray-500">Amount / Method</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs">{o.id}</div>
                    <div className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-gray-500">{o.phone}</div>
                    <div className="text-gray-400 text-xs mt-1 w-48 truncate">{o.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    {o.products?.map((p: any, i: number) => (
                      <div key={i} className="text-xs text-gray-600">{p.quantity}x {p.title}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">₹{o.amount}</div>
                    <div className="text-gray-500 text-xs">{o.payment_method}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${o.status === 'completed' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
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
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.025 14.114 1 11.49 1a9.86 9.86 0 0 0-9.855 9.804c-.001 1.73.488 3.391 1.412 4.878l-.947 3.46 3.547-.93zM17.527 14.31c-.327-.164-1.94-.957-2.24-1.066-.301-.11-.521-.164-.74.164-.22.33-.85.1.066-1.042.11-.19.223-.19.55-.328.327-.137.49-.602.245-.93-.247-.327-.74-1.123-.74-1.37a1.05 1.05 0 0 0-.74-.11c-1.05.11-1.82.957-1.82 2.016 0 .548.21 1.077.584 1.45a16.65 16.65 0 0 0 4.148 4.14v1.1c0 .33.165.65.274.9h.22c.428-.056.883-.357 1.127-.723s.245-.733.172-.942c-.074-.11-.3-.22-.627-.384z"/>
                          </svg>
                        </a>
                      );
                    })()}
                    {o.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(o.id, "completed")} className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100" title="Complete Order"><Check className="w-4 h-4"/></button>
                        <button onClick={() => updateStatus(o.id, "cancelled")} className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100" title="Cancel Order"><X className="w-4 h-4"/></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
