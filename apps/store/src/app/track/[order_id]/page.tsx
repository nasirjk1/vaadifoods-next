"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, MapPin, Calendar, CreditCard, ChevronRight, RefreshCw, Sparkles, Building2, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderTrackingPage({ params }: { params: Promise<{ order_id: string }> }) {
  const { order_id } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", order_id)
        .maybeSingle();

      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error("Tracking details failed to fetch:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_id]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
  };

  // Convert status back and forth safely
  const rawStatus = order?.orderStatus || order?.order_status || "Pending";
  const cleanStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  // Status mapping to indices
  const statusSteps = [
    { label: "Order Received", subtitle: "Transaction validated", key: "Pending" },
    { label: "Processing", subtitle: "Direct lab sampling", key: "Processing" },
    { label: "Order In Transit", subtitle: "Premium courier", key: "Shipped" },
    { label: "Delivered", subtitle: "Delivered standard", key: "Delivered" }
  ];

  // Determine active step index
  let activeIndex = 0; // default for Pending
  if (cleanStatus === "Processing") activeIndex = 1;
  else if (cleanStatus === "Shipped") activeIndex = 2;
  else if (cleanStatus === "Delivered") activeIndex = 3;

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
          <h2 className="font-serif text-3xl font-black mb-4">Verification Check Pending</h2>
          <p className="text-slate-500 font-light text-sm leading-relaxed mb-8">
            The requested tracking reference <code className="font-mono bg-[#0F2E1E]/5 px-2 py-0.5 rounded text-xs font-bold">{order_id}</code> could not be located in our database registries. Direct database synchronization can occasionally take up to 2-3 minutes.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleManualRefresh}
              className="px-6 py-3.5 border border-emerald-950/20 hover:bg-white text-[#0F2E1E] font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh Registry
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              Back to Store
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#FF9933] selection:text-white">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 md:py-20 space-y-12 animate-fade-in">
        {/* Dynamic Tracking Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-950/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FF9933]">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span className="font-black uppercase text-xs tracking-[0.25em]">REAL-TIME ORDER TRACKER</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#0F2E1E]">
              Track Package <span className="font-mono font-light text-[#FF9933] bg-[#FF9933]/15 px-3 py-1 rounded text-xl border border-[#FF9933]/25 uppercase">{order.id}</span>
            </h1>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="self-start md:self-auto bg-white border border-emerald-950/10 hover:border-[#FF9933] text-[#0F2E1E] hover:text-[#FF9933] px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 disabled:opacity-75 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> 
            {refreshing ? "Syncing..." : "Update Live Status"}
          </button>
        </div>

        {/* Beautiful Progressive Transit Stepper */}
        <div className="bg-white border border-[#0F2E1E]/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
          <h3 className="font-serif text-lg font-bold text-[#0F2E1E]">
            Package Movement Progress
          </h3>

          <div className="relative">
            {/* Background Line Connector */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-100 hidden md:block"></div>
            {/* Active Colored Portion */}
            <div 
              className="absolute top-5 left-6 h-0.5 bg-vaadi-green hidden md:block transition-all duration-1000 ease-out"
              style={{ width: `${(activeIndex / (statusSteps.length - 1)) * 95}%` }}
            ></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <div key={idx} className="flex gap-4 md:flex-col md:items-center md:text-center group">
                    {/* Circle Node */}
                    <div 
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isCompleted 
                          ? "bg-vaadi-green border-white text-white shadow-md shadow-emerald-800/10" 
                          : "bg-white border-slate-100 text-slate-300"
                      } ${isActive ? "ring-4 ring-vaadi-green/20 animate-pulse bg-vaadi-green border-white text-white scale-110" : ""}`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : (
                        <span className="font-serif text-sm font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step description detail */}
                    <div className="space-y-1 pt-1.5 md:pt-0">
                      <h4 className={`font-serif text-sm font-black transition-colors ${
                        isCompleted ? "text-[#0F2E1E]" : "text-slate-400 font-bold"
                      } ${isActive ? "text-[#FF9933]" : ""}`}>
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Breakdown Panel: Details & Items Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sourced Items Card */}
          <div className="bg-white border border-[#0F2E1E]/5 rounded-[2rem] p-6 shadow-sm space-y-6 md:col-span-2">
            <h4 className="font-serif text-base font-bold text-[#0F2E1E]/80 border-b border-slate-50 pb-4">
              Ordered Items
            </h4>

            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-[#FAF7F0]/30 p-4 rounded-xl border border-slate-50 hover:bg-[#FAF7F0]/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full bg-[#0F2E1E] text-[#FAF7F0] flex items-center justify-center font-bold text-xs shrink-0">
                      {item.quantity}x
                    </span>
                    <div>
                      <h5 className="font-serif text-sm font-bold text-[#0F2E1E] line-clamp-1">{item.product?.title || "Premium Selection"}</h5>
                      <span className="text-[9px] uppercase font-bold text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {item.selectedWeight || "Standard Weight"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">₹{item.selectedPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price Footer breakdown */}
            <div className="pt-6 border-t border-slate-50 space-y-2.5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Total Items value</span>
                <span>₹{order.subtotalAmount || (order.totalAmount - (order.shippingCost || 0))}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Shipping Fee</span>
                <span>{order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-serif font-black text-[#0F2E1E] text-base">Grand Paid Amount</span>
                <span className="font-serif font-black text-vaadi-green text-xl">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Quick Logistic details Card */}
          <div className="bg-white border border-[#0F2E1E]/5 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <h4 className="font-serif text-base font-bold text-[#0F2E1E]/80 border-b border-slate-50 pb-4">
                Shipping Information
              </h4>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-vaadi-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lodgement Date</h5>
                    <p className="text-xs font-medium text-slate-800 mt-1">
                      {new Date(order.created_at || Date.now()).toLocaleDateString([], { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>

                {/* Address info */}
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-vaadi-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shipping Address</h5>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed capitalize-first mt-1">
                      {order.shippingAddress?.fullName} <br />
                      {order.shippingAddress?.addressLines}
                    </p>
                  </div>
                </div>

                {/* Payment destination */}
                <div className="flex gap-3">
                  <CreditCard className="w-5 h-5 text-vaadi-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Settlement Method</h5>
                    <p className="text-xs font-bold text-vaadi-green mt-1 tracking-wider">
                      {order.paymentMethod || "COD"}
                    </p>
                  </div>
                </div>

                {/* Packaging region note */}
                <div className="p-4 bg-emerald-950/5 border border-emerald-950/10 rounded-2xl flex items-start gap-2.5 mt-4">
                  <Building2 className="w-5 h-5 text-vaadi-green shrink-0 mt-0.5" />
                  <p className="text-[10px] font-medium leading-relaxed text-[#0F2E1E]">
                    Processed and packed under optimal warehouse conditions. Direct shipment certified.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="w-full text-center py-4 rounded-xl bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-bold text-xs uppercase tracking-widest transition-all shadow-md mt-6"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
