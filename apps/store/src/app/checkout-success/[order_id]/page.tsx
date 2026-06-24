"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, MapPin, Truck, Phone, MessageSquare, ArrowRight, ClipboardList } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutSuccessPage({ params }: { params: Promise<{ order_id: string }> }) {
  const { order_id } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("Error loading order:", error);
        if (data) setOrder(data);
        setLoading(false);
      });
  }, [order_id]);

  const handleWhatsAppRedirect = () => {
    if (!order) return;
    
    // Compile nice WhatsApp message
    const itemsListText = order.items
      ?.map((i: any) => `• ${i.product?.title || "Item"} (x${i.quantity}) - ₹${i.selectedPrice * i.quantity}`)
      .join("\n") || "";

    const message = `*VAADI FOODS STORE - NEW ORDER SUCCESS*\n\n*Order Ref*: ${order.id}\n*Date*: ${new Date(order.created_at || Date.now()).toLocaleDateString()}\n*Status*: ${order.orderStatus || "Pending"}\n\n*Customer Details*:\n*Name*: ${order.shippingAddress?.fullName}\n*Phone*: ${order.shippingAddress?.phone}\n*Address*: ${order.shippingAddress?.addressLines}\n*Payment*: ${order.paymentMethod}\n\n*Items Ordered*:\n${itemsListText}\n\n*Shipping Cost*: ${order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}\n*Grand Total*: *₹${order.totalAmount}*\n\nPlease confirm our delivery dispatch.`;
    
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#0F2E1E] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-between text-[#0F2E1E]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto py-20">
          <ClipboardList className="w-16 h-16 text-[#FF9933]/40 mb-6" />
          <h2 className="font-serif text-3xl font-black mb-4">Verification Search Still Processing</h2>
          <p className="text-slate-500 font-light text-sm leading-relaxed mb-8">
            Your Order reference <code className="font-mono bg-[#0F2E1E]/5 px-2 py-0.5 rounded text-xs font-bold">{order_id}</code> could not be found yet in safe storage. However, if your transaction went through, it is secure.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
          >
            Return to Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#FF9933] selection:text-white">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 md:py-24 space-y-12">
        {/* Main Success Greeting */}
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-md relative scale-95 animate-[scale-in_0.5s_ease-out]">
            <Check className="w-10 h-10 text-vaadi-green stroke-[3]" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.25em] block">
              TRANSACTION VERIFIED & SECURED
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0F2E1E] leading-tight">
              Thank you for ordering from <span className="text-vaadi-green">Vaadi Foods</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
              Your order is registered and is being prepared for shipment.
            </p>
          </div>
        </div>

        {/* Detailed Receipt Card */}
        <div className="bg-white border border-[#0F2E1E]/5 rounded-[2.5rem] p-6 md:p-10 shadow-sm grid md:grid-cols-2 gap-8 md:gap-12 relative overflow-hidden">
          {/* Decorative Top Accent line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-vaadi-green via-[#FF9933] to-green-950"></div>
          
          {/* Left Side: Order Info Details */}
          <div className="space-y-6 md:border-r border-slate-100 md:pr-12">
            <h3 className="font-serif text-lg font-bold text-[#0F2E1E] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF9933]" /> Order Summary S00{order_id.split("-")[2] || "1"}
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order ID</span>
                <span className="font-mono text-xs font-black text-[#0F2E1E] bg-[#0F2E1E]/5 px-3 py-1 rounded-full">{order.id}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Status</span>
                <span className="text-[10px] font-black tracking-widest text-[#FF9933] bg-[#FF9933]/15 border border-[#FF9933]/25 px-4 py-1.5 rounded-full uppercase">
                  {order.orderStatus || "Pending"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Amount</span>
                <span className="font-bold text-vaadi-green text-lg">₹{order.totalAmount}</span>
              </div>

              <div className="flex justify-between items-center py-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Delivery</span>
                <span className="font-serif text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-vaadi-green" /> 3 - 5 Business Days
                </span>
              </div>
            </div>

            {/* Delivery address brief preview */}
            <div className="p-4 bg-[#FAF7F0]/60 rounded-2xl border border-emerald-950/5 flex items-start gap-3 mt-4">
              <MapPin className="w-5 h-5 text-vaadi-gold shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[#0F2E1E]">Shipping Destination</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed capitalize-first">
                  {order.shippingAddress?.fullName} <br />
                  {order.shippingAddress?.addressLines}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Sourced Items Summary */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-black text-[#0F2E1E]/60 mb-4">
                Ordered Items
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-[#FAF7F0]/30 border border-slate-50 p-3 rounded-xl transition-all hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold bg-[#0F2E1E] text-[#FAF7F0] w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </span>
                      <span className="text-xs font-bold font-serif text-[#0F2E1E] line-clamp-1">{item.product?.title || "Premium Item"}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 shrink-0">₹{item.selectedPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Action Callouts */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {/* WhatsApp Direct */}
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-4 bg-[#25D366] text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#20BE5A] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-current" /> Send Order on WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-3">
                {/* Track Order */}
                <Link
                  href={`/track/${order.id}`}
                  className="py-4 bg-[#0F2E1E] text-white hover:bg-[#FF9933] hover:text-[#0F2E1E] font-black rounded-xl text-center text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                >
                  Track Order <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="py-4 border border-slate-200 bg-white text-slate-600 hover:bg-[#FAF7F0] font-black rounded-xl text-center text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center"
                >
                  Shop Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
