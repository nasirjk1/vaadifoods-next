"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r text-sm">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg">Vaadi Admin</div>
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/" className="px-4 py-2 bg-gray-100 rounded-md font-medium text-black">Dashboard</Link>
          <Link href="/products" className="px-4 py-2 hover:bg-gray-50 rounded-md text-gray-600">Products</Link>
          <Link href="/orders" className="px-4 py-2 hover:bg-gray-50 rounded-md text-gray-600">Orders</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl border flex flex-col gap-2">
            <div className="text-gray-500 font-medium flex items-center justify-between">Total Orders <ShoppingCart className="w-4 h-4" /></div>
            <div className="text-3xl font-bold">{orders.length}</div>
          </div>
          <div className="p-6 bg-white rounded-xl border flex flex-col gap-2">
            <div className="text-gray-500 font-medium flex items-center justify-between">Total Revenue <DollarSign className="w-4 h-4" /></div>
            <div className="text-3xl font-bold">₹{orders.reduce((acc, o) => acc + (o.amount || 0), 0)}</div>
          </div>
          <div className="p-6 bg-white rounded-xl border flex flex-col gap-2">
            <div className="text-gray-500 font-medium flex items-center justify-between">Products <Package className="w-4 h-4" /></div>
            <div className="text-3xl font-bold">Manage »</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b font-medium">Recent Orders</div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="px-6 py-4">{o.id}</td>
                    <td className="px-6 py-4">{o.customer_name}</td>
                    <td className="px-6 py-4">₹{o.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">{o.status}</span>
                    </td>
                    <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
