"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, 
  MessageSquare, ShieldCheck, ShoppingCart, Info, MapPin, Phone, User 
} from "lucide-react";
import { 
  getCart, saveCart, removeFromCart, updateCartQuantity, 
  closeCartDrawer, CART_CHANGE_EVENT, CART_DRAWER_EVENT, CartItem 
} from "@/lib/cart-store";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', payment_method: 'COD' });

  useEffect(() => {
    // Initial fetch
    setCartItems(getCart());

    const handleCartToggle = (e: any) => {
      if (e.detail && typeof e.detail.open === 'boolean') {
        setIsOpen(e.detail.open);
      } else {
        setIsOpen(prev => !prev);
      }
    };

    const handleCartChange = (e: any) => {
      setCartItems(e.detail || getCart());
    };

    window.addEventListener(CART_DRAWER_EVENT, handleCartToggle);
    window.addEventListener(CART_CHANGE_EVENT, handleCartChange);

    return () => {
      window.removeEventListener(CART_DRAWER_EVENT, handleCartToggle);
      window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
    };
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 799;
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please enter all details for shipping.");
      return;
    }
    setProcessing(true);

    try {
      // Generate unique sequential Order ID
      const { count } = await supabase.from("orders").select("id", { count: "exact", head: true });
      const nextSeq = (count || 0) + 1;
      let orderId = `VF-2026-${String(nextSeq).padStart(4, "0")}`;
      
      let attempt = 0;
      while (attempt < 5) {
        const { data } = await supabase.from("orders").select("id").eq("id", orderId);
        if (!data || data.length === 0) {
          break;
        }
        attempt++;
        orderId = `VF-2026-${String(nextSeq + attempt).padStart(4, "0")}`;
      }

      const orderData = {
        id: orderId,
        items: cartItems.map(item => ({
          product: { id: item.id, title: item.name, price: item.price },
          quantity: item.quantity,
          selectedPrice: item.price,
          selectedWeight: item.weight || "Standard"
        })),
        shippingAddress: {
          fullName: formData.name,
          phone: formData.phone,
          email: "guest-checkout@vaadifoods.com",
          addressLines: formData.address,
          city: "",
          state: "",
          pincode: "",
          country: "India"
        },
        paymentMethod: formData.payment_method,
        paymentStatus: "Pending",
        shippingCost: total >= freeShippingThreshold ? 0 : 99,
        orderStatus: "Pending",
        date: new Date().toISOString().split("T")[0],
        totalAmount: total + (total >= freeShippingThreshold ? 0 : 99),
        subtotalAmount: total,
      };

      // Create order entry in DB
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      // Seed lead
      await supabase.from("leads").insert([{ name: formData.name, phone: formData.phone }]);

      // Clean cart
      saveCart([]);
      setIsCheckout(false);
      setIsOpen(false);
      
      // Redirect to Success Page!
      router.push(`/checkout-success/${orderId}`);
    } catch (err: any) {
      console.error("Checkout process failed:", err);
      alert("Order could not be saved to Supabase currently: " + (err.message || err));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-md md:max-w-lg bg-[#FAF7F0] h-full shadow-2xl flex flex-col z-10 border-l border-emerald-950/20"
          >
            {/* Header */}
            <div className="p-6 bg-[#0F2E1E] text-[#FAF7F0] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#FF9933]" />
                <h2 className="font-serif font-bold text-2xl tracking-tight">Your Selection</h2>
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{cartItems.length} items</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner scroll container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!isCheckout ? (
                <>
                  {/* Dynamic Free Shipping Progress Bar */}
                  {cartItems.length > 0 && (
                    <div className="p-4 bg-emerald-950/5 border border-emerald-950/10 rounded-2xl">
                      <div className="text-sm text-[#0F2E1E] font-medium flex items-center justify-between mb-2">
                        {total >= freeShippingThreshold ? (
                          <span className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase tracking-wider text-xs">
                            🎉 Your shipping is completely COMPLIMENTARY!
                          </span>
                        ) : (
                          <span>
                            Add <strong className="text-emerald-800">₹{freeShippingThreshold - total}</strong> more for <strong className="text-[#FF9933]">FREE Delivery</strong>
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#0F2E1E]/60">{progressPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-[#0F2E1E]/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#FF9933] h-full transition-all duration-500 ease-out" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {cartItems.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-[#0F2E1E]/5 text-[#0F2E1E]/30 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart className="w-10 h-10" />
                      </div>
                      <p className="font-serif text-xl text-[#0F2E1E]/70 font-semibold mb-2">Your basket is feeling light</p>
                      <p className="text-sm text-slate-500 max-w-sm mb-8">Discover our hand-picked Kashmiri dry fruits, organic white honey, and premium A+++ grade saffron.</p>
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="bg-[#0F2E1E] text-white hover:bg-[#FF9933] hover:text-[#0F2E1E] px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-lg"
                      >
                        Keep Exploring
                      </button>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-2xl border border-emerald-950/5 flex gap-4 transition-all hover:shadow-md hover:border-emerald-950/10">
                        <div className="w-20 h-20 bg-[#FAF7F0] rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#0F2E1E]/20"><ShoppingBag className="w-6 h-6"/></div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h4 className="font-bold text-[#0F2E1E] font-serif text-base line-clamp-1 leading-tight mb-1">{item.name}</h4>
                          {item.weight && <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF9933] mb-2">{item.weight}</span>}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-[#0F2E1E]">₹{item.price * item.quantity}</span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-slate-400">₹{item.price} each</span>
                              )}
                            </div>
                            
                            {/* Quantity selection */}
                            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full scale-90">
                              <button 
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 p-1.5 self-start transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Checkout Form Screen in Drawer */
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm text-[#0F2E1E]/60 mb-2 font-bold uppercase tracking-widest">
                    <button onClick={() => setIsCheckout(false)} className="hover:text-[#FF9933] transition-colors flex items-center gap-1">
                      ← Edit Basket
                    </button>
                    <span>/</span>
                    <span className="text-[#0F2E1E]">Shipment Details</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-[#0F2E1E] tracking-tight">Shipping Details</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">Packed and shipped securely to your delivery address. Safe delivery guaranteed.</p>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/60 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF9933]"/> Full Name
                      </label>
                      <input 
                        required 
                        placeholder="e.g. Aditi Sharma" 
                        className="w-full p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] outline-none rounded-xl transition-all font-medium text-slate-800 shadow-sm text-sm"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/60 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF9933]"/> Phone Number (with WhatsApp)
                      </label>
                      <input 
                        required 
                        type="tel" 
                        placeholder="e.g. 9876543210 (Needed for dispatch)" 
                        className="w-full p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] outline-none rounded-xl transition-all font-medium text-slate-800 shadow-sm text-sm"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/60 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9933]"/> Complete Delivery Address
                      </label>
                      <textarea 
                        required 
                        placeholder="Apartment/House No, Street, Landmark, Pin Code" 
                        className="w-full p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] outline-none rounded-xl transition-all font-medium text-slate-800 shadow-sm h-24 resize-none text-sm"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/60 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF9933]"/> Payment Destination
                      </label>
                      <select 
                        required 
                        className="w-full p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] outline-none rounded-xl transition-all font-medium text-slate-800 shadow-sm text-sm"
                        value={formData.payment_method}
                        onChange={e => setFormData({...formData, payment_method: e.target.value})}
                      >
                        <option value="COD">Cash on Delivery (Standard)</option>
                        <option value="Razorpay">Razorpay / Instant Secure UPI QR</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={processing}
                      className="w-full mt-6 py-4 bg-[#0F2E1E] text-[#FAF7F0] font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-[#FF9933] hover:text-[#0F2E1E] transition-colors shadow-lg shadow-emerald-950/20 disabled:opacity-75 flex items-center justify-center gap-2"
                    >
                      {processing ? "Dispatching..." : (
                        <>
                          Confirm Order via WhatsApp <ArrowRight className="w-4 h-4"/>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer summary - cart items exist */}
            {cartItems.length > 0 && !isCheckout && (
              <div className="p-6 bg-white border-t border-emerald-950/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Selected basket</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Insured shipping</span>
                    <span>{total >= freeShippingThreshold ? (
                      <span className="text-green-600 font-bold uppercase tracking-widest">Free</span>
                    ) : "₹99"}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="font-serif font-bold text-[#0F2E1E] text-lg">Total Amount</span>
                    <span className="font-serif font-bold text-[#0F2E1E] text-2xl">
                      ₹{total + (total >= freeShippingThreshold ? 0 : 99)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => {
                      const message = `*Vaadi Foods Order Inquiry*%0A${cartItems.map(i => `• ${i.name} (x${i.quantity})`).join('%0A')}%0A%0A*Approx Total*: ₹${total}`;
                      window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
                    }}
                    className="py-4 bg-[#25D366] text-white font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-[#20BE5A] transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" /> WhatsApp Order
                  </button>
                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="py-4 bg-[#0F2E1E] text-[#FAF7F0] hover:bg-[#FF9933] hover:text-[#0F2E1E] font-bold rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98]"
                  >
                    Express Pay <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
