"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Package, Check, Sparkles } from "lucide-react";
import { addToCart, toggleWishlist, getWishlist, WISHLIST_CHANGE_EVENT } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: any;
  index: number;
}

const getSlug = (name: string) => name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isWished, setIsWished] = useState(false);
  const [showAddedCheck, setShowAddedCheck] = useState(false);

  useEffect(() => {
    // Initial check
    const wishlist = getWishlist();
    setIsWished(wishlist.some(i => i.id === product.id));

    // Follow changes
    const handleWishChange = (e: any) => {
      const items = e.detail || getWishlist();
      setIsWished(items.some((i: any) => i.id === product.id));
    };

    window.addEventListener(WISHLIST_CHANGE_EVENT, handleWishChange);
    return () => window.removeEventListener(WISHLIST_CHANGE_EVENT, handleWishChange);
  }, [product.id]);

  const handleWishToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]
    });
    setIsWished(added);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0],
      weight: product.category === "Saffron" ? "1g Standard" : "500g Standard"
    }, 1);

    // Show instant micro-interaction
    setShowAddedCheck(true);
    setTimeout(() => {
      setShowAddedCheck(false);
    }, 2000);
  };

  const discount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.4) }}
      className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-[#FF9933]/20 shadow-sm hover:shadow-2xl hover:shadow-[#0F2E1E]/5 transition-all duration-500 h-full transform hover:-translate-y-1.5"
    >
      {/* Product Image Holder */}
      <div className="relative aspect-[4/5] bg-[#FAF7F0] overflow-hidden m-3 rounded-[1.8rem] border border-slate-50">
        <Link prefetch href={`/product/${getSlug(product.name)}`} className="absolute inset-0 z-10 block">
          {product.images?.[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out select-none" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#0F2E1E]/20 bg-[#FAF7F0]">
              <Package className="w-16 h-16"/>
            </div>
          )}
        </Link>
        
        {/* Promotion Banner Details */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          {discount > 0 && (
            <span className="bg-[#FF9933] text-[#0F2E1E] text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              {discount}% OFF
            </span>
          )}
          {product.category === "Saffron" && (
            <span className="bg-[#0F2E1E] text-[#FAF7F0] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 border border-white/10 shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3 text-[#FF9933]" /> A+++ GRADE
            </span>
          )}
        </div>

        {/* Floating Heart Button */}
        <button 
          onClick={handleWishToggle}
          className="absolute top-4 right-4 z-20 w-11 h-11 bg-white/80 backdrop-blur-md text-[#0F2E1E] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-md group/heart"
        >
          <Heart className={`w-5 h-5 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-[#0F2E1E] group-hover/heart:text-red-500'}`} />
        </button>

        {/* Hover Quick Action Panel */}
        <div className="absolute inset-x-0 bottom-4 px-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden lg:block">
          <button 
            onClick={handleAddToCart}
            className={`w-full font-bold py-4.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-98 ${
              showAddedCheck 
                ? 'bg-emerald-800 text-white shadow-emerald-800/10' 
                : 'bg-[#0F2E1E] text-white hover:bg-[#FF9933] hover:text-[#0F2E1E] shadow-[#0F2E1E]/10'
            }`}
          >
            {showAddedCheck ? (
              <>
                <Check className="w-4 h-4 text-white" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Label */}
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF9933] mb-2.5 block">
          {product.category || "Premium Selection"}
        </span>

        {/* Custom Star Rating Gauge */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${product.rating && Math.floor(product.rating) >= star ? 'fill-current' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1.5">
            ({product.rating || "5.0"}) Reviews
          </span>
        </div>

        {/* Product Title */}
        <Link prefetch href={`/product/${getSlug(product.name)}`} className="block group-hover:text-[#FF9933] transition-colors mb-3">
          <h3 className="font-serif font-black text-[#0F2E1E] text-lg md:text-xl leading-snug line-clamp-2 min-h-[3.25rem]">
            {product.name}
          </h3>
        </Link>
        
        {/* Short description snippet */}
        <p className="text-slate-500 font-light text-xs line-clamp-2 leading-relaxed mb-6">
          {product.description || "Direct source Kashmiri specialty harvested under organic standards."}
        </p>

        {/* Pricing Segment */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">PRICE FROM</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-xl text-[#0F2E1E] md:text-2xl">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`lg:hidden w-11 h-11 border rounded-2xl flex items-center justify-center transition-all ${
              showAddedCheck 
                ? 'bg-emerald-800 border-emerald-800 text-white' 
                : 'border-[#0F2E1E] text-[#0F2E1E] hover:bg-[#FF9933] hover:text-[#0F2E1E] hover:border-[#FF9933]'
            }`}
          >
            {showAddedCheck ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <ShoppingBag className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
