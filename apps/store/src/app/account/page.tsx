"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, MapPin, ClipboardList, LogOut, Sparkles, Plus, Trash2, Home, Crosshair, Map, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLines: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ fullName: string; phone: string }>({ fullName: "", phone: "" });
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address Dialog state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressLines, setNewAddressLines] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    // Check initial session
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Protect route
        return;
      }
      
      const currentUser = session.user;
      setUser(currentUser);
      
      // Load details from user metadata
      const meta = currentUser.user_metadata || {};
      setProfile({
        fullName: meta.full_name || meta.fullName || "",
        phone: meta.phone || "",
      });

      // Load saved addresses from user metadata
      setAddresses(meta.saved_addresses || []);
      setLoading(false);

      // Fetch order history for matching phone number or full name/email
      fetchOrderHistory(meta.phone || currentUser.phone || "", meta.full_name || "", currentUser.email || "");
    };

    loadSession();
  }, [router]);

  const fetchOrderHistory = async (phone: string, fullName: string, email: string) => {
    setOrdersLoading(true);
    try {
      // Query raw order items
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Since there's no native relationship column, we filter match on:
        // 1. Phone number (cleaned)
        // 2. Full Name
        const cleanTargetPhone = phone.replace(/[^0-9]/g, "");
        const matched = data.filter((o: any) => {
          const sAddress = o.shippingAddress || {};
          const orderPhoneClean = (sAddress.phone || "").replace(/[^0-9]/g, "");
          const orderName = sAddress.fullName || "";
          
          const isPhoneMatch = cleanTargetPhone && orderPhoneClean && (orderPhoneClean === cleanTargetPhone || orderPhoneClean.includes(cleanTargetPhone) || cleanTargetPhone.includes(orderPhoneClean));
          const isNameMatch = fullName && orderName && orderName.toLowerCase().trim() === fullName.toLowerCase().trim();
          
          return isPhoneMatch || isNameMatch;
        });

        setOrders(matched);
      }
    } catch (err) {
      console.error("Failed to load matching order history:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newFullName || !newPhone || !newAddressLines) return;
    setSavingAddress(true);

    const newAddressObj: SavedAddress = {
      id: Math.random().toString(36).substring(2, 9),
      label: newLabel,
      fullName: newFullName,
      phone: newPhone,
      addressLines: newAddressLines
    };

    const updatedAddresses = [...addresses, newAddressObj];

    try {
      // Persist in metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          saved_addresses: updatedAddresses
        }
      });

      if (error) throw error;

      setAddresses(updatedAddresses);
      setIsAddingAddress(false);
      // reset
      setNewLabel("Home");
      setNewFullName("");
      setNewPhone("");
      setNewAddressLines("");
    } catch (err: any) {
      console.error("Address update failed:", err);
      alert("Failed updating addresses: " + err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    const filtered = addresses.filter(addr => addr.id !== id);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          saved_addresses: filtered
        }
      });

      if (error) throw error;
      setAddresses(filtered);
    } catch (err: any) {
      console.error("Address delete failed:", err);
      alert("Failed deleting address: " + err.message);
    }
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

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#FF9933] selection:text-white">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-16 md:py-24 space-y-10">
        
        {/* Dynamic visual title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#0F2E1E]/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[#FF9933]">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span className="font-black uppercase text-xs tracking-[0.25em] block">
                ACCOUNT DASHBOARD
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0F2E1E]">
              My Account
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto flex items-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 hover:border-red-500 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out Portal
          </button>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column 1: Customer Profile Overview Card */}
          <div className="space-y-8">
            <div className="bg-white border border-[#0F2E1E]/5 rounded-[2rem] p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#FF9933]"></div>
              
              <h3 className="font-serif text-lg font-bold text-[#0F2E1E] flex items-center gap-2 pb-4 border-b border-slate-50">
                <User className="w-4.5 h-4.5 text-[#FF9933]" /> My Profile
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Customer Name</span>
                  <p className="text-sm font-bold text-[#0F2E1E] bg-[#FAF7F0]/40 p-3 rounded-xl border border-dashed border-[#0F2E1E]/5">
                    {profile.fullName || "Unverified Member"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Email Registry</span>
                  <div className="flex items-center gap-2 bg-[#FAF7F0]/40 p-3 rounded-xl border border-dashed border-[#0F2E1E]/5 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold truncate">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">WhatsApp Link</span>
                  <div className="flex items-center gap-2 bg-[#FAF7F0]/40 p-3 rounded-xl border border-dashed border-[#0F2E1E]/5 text-slate-600">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold">{profile.phone || "Not Registered"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Addresses SubSection */}
            <div className="bg-white border border-[#0F2E1E]/5 rounded-[2rem] p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-vaadi-green"></div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <h3 className="font-serif text-base font-bold text-[#0F2E1E] flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-vaadi-gold" /> Saved Addresses
                </h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="p-1 px-2.5 bg-emerald-50 hover:bg-[#FF9933]/20 text-[#0F2E1E] rounded-md border border-[#0F2E1E]/5 hover:border-[#FF9933] transition-colors text-[10px] uppercase tracking-wider font-bold flex items-center gap-0.5 cursor-pointer focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" /> Address
                </button>
              </div>

              {/* Form to Add Address */}
              {isAddingAddress && (
                <form onSubmit={handleSaveAddress} className="space-y-3.5 p-4 bg-[#FAF7F0]/80 rounded-2xl border border-[#0F2E1E]/5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Badge</label>
                      <select
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="w-full p-2 bg-white text-xs rounded-lg border border-slate-100 outline-none font-bold"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Receipt Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Shahzaib K."
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="w-full p-2 bg-white text-xs rounded-lg border border-slate-100 outline-none font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">WhatsApp Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2 bg-white text-xs rounded-lg border border-slate-100 outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Delivery Address</label>
                    <textarea
                      required
                      placeholder="Flat 101, Block D, Pampore"
                      rows={2}
                      value={newAddressLines}
                      onChange={(e) => setNewAddressLines(e.target.value)}
                      className="w-full p-2 bg-white text-xs rounded-lg border border-slate-100 outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-bold text-[9px] uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="px-4 py-1.5 bg-[#0F2E1E] text-[#FAF7F0] hover:bg-[#FF9933] hover:text-[#0F2E1E] rounded-md font-bold text-[9px] uppercase tracking-wider"
                    >
                      {savingAddress ? "Saving..." : "Save Selection"}
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              {addresses.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-light space-y-1">
                  <p>No addresses logged previously.</p>
                  <p className="text-[10px] text-[#FF9933] font-semibold">Store any address cards for single-tap checkouts!</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100/50 rounded-2xl flex items-start gap-3 relative group transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#0F2E1E]/5 group-hover:bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pr-6 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase font-black tracking-widest text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded">
                            {addr.label}
                          </span>
                          <span className="text-xs font-bold text-[#0F2E1E]">{addr.fullName}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-light leading-relaxed">{addr.addressLines}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {addr.phone}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="absolute right-3 top-3 p-1.5 text-slate-300 hover:text-red-500 rounded-md transition-all cursor-pointer hover:bg-red-50/50"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Order History Cards (lg:colspan-2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#0F2E1E]/5 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6 min-h-[500px]">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="font-serif text-lg font-bold text-[#0F2E1E] flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-vaadi-green animate-pulse" /> Order History
                </h3>
                
                <span className="text-[10px] bg-slate-150 text-slate-500 px-3 py-1 rounded-full font-bold">
                  {orders.length} Order{orders.length === 1 ? "" : "s"}
                </span>
              </div>

              {ordersLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#0F2E1E] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing database files...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <ClipboardList className="w-16 h-16 text-[#FF9933]/10 mx-auto" />
                  <div className="space-y-1.5">
                    <p className="font-serif text-base font-bold text-slate-400">No Orders Saved Under This Profile</p>
                    <p className="text-xs text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                      Orders are matched using your **Phone Number ({profile.phone || "not registered"})** or name. Order matching is dynamic. Any orders checkout using this number will automatically show here in high fidelity.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow"
                  >
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => {
                    const trackingUrl = `/track/${o.id}`;

                    return (
                      <div key={o.id} className="border border-[#0F2E1E]/5 rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all hover:bg-slate-50/50 bg-white shadow-sm space-y-4 relative overflow-hidden">
                        <div className="absolute left-0 inset-y-0 w-1.5 bg-[#FF9933]"></div>

                        {/* Top Line */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-dashed border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-[#0F2E1E] bg-[#0F2E1E]/5 px-2.5 py-0.5 rounded-full">{o.id}</span>
                              <span className="text-[10px] font-black tracking-wider uppercase text-[#FF9933] bg-[#FF9933]/15 px-2.5 py-0.5 rounded-full">
                                {o.orderStatus || "Pending"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Lodged {new Date(o.created_at || o.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Settled Amount</span>
                            <span className="font-serif text-lg font-black text-vaadi-green">₹{o.totalAmount}</span>
                          </div>
                        </div>

                        {/* Middle List Items preview */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Ordered Items</span>
                          <div className="grid md:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                            {o.items?.map((item: any, idx: number) => (
                              <div key={idx} className="bg-[#FAF7F0]/30 border border-slate-50/50 p-2.5 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 max-w-[80%]">
                                  <span className="text-[10px] bg-[#0F2E1E] text-[#FAF7F0] w-5 h-5 rounded-full flex items-center justify-center font-black shrink-0">
                                    {item.quantity}x
                                  </span>
                                  <span className="text-xs font-bold text-slate-700 line-clamp-1">{item.product?.title || "Harvest Selection"}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#FF9933]">₹{item.selectedPrice * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-50">
                          {/* Shipping Destination preview */}
                          <p className="text-[10px] text-slate-500 font-light truncate max-w-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#FF9933] inline-block mr-1" />
                            To: <span className="font-bold text-slate-700">{o.shippingAddress?.fullName}</span>, {o.shippingAddress?.addressLines}
                          </p>

                          <Link
                            href={trackingUrl}
                            className="inline-flex items-center gap-1 text-[10px] bg-[#0F2E1E] hover:bg-[#FF9933] text-white hover:text-[#0F2E1E] font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl transition-all self-end md:self-auto shadow-sm"
                          >
                            Live Tracker <Crosshair className="w-3.5 h-3.5 animate-pulse" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
