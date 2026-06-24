"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";

const getSlug = (name: string) => name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

const fallbackProducts = [
  {
    id: "s saffron-mongra-grade-1",
    name: "Kashmiri Mongra Saffron (A+++ Grade - Pampore Sourced)",
    price: 399,
    originalPrice: 499,
    rating: 4.9,
    category: "Saffron",
    description: "Sourced directly from pristine farms of Pampore. Highest crocin counts with extra-long crimson filaments to assure incredible flavor, aroma, and health properties.",
    images: ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800", "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800"]
  },
  {
    id: "s almonds-mammra-giri",
    name: "Mammra Almonds Giri (Natural High-Oil Dry Fruit)",
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    category: "Dry Fruits",
    description: "Rich, highly sought-after native species of Mamra Almonds containing massive natural oil density. Untreated and packed organically with zero preservatives.",
    images: ["https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800"]
  },
  {
    id: "s honey-white-acacia",
    name: "Pure Himalayan White Honey (Acacia Meadow Blossom)",
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    category: "Honey",
    description: "Extracted carefully from Acacia wild flowers blooming in Kashmir high fields. Delicate, smooth, naturally white texture having marvelous antioxidant properties.",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800"]
  },
  {
    id: "s walnut-kaghzi-paper",
    name: "Kashmiri Paper-Shell Walnuts (Premium Kaghzi Quality)",
    price: 499,
    originalPrice: 650,
    rating: 4.7,
    category: "Dry Fruits",
    description: "Double-inspected walnuts having paper-thin natural shells that can be broken by standard hand squeezing. Fully intact whole golden kernels rich in Omega-3.",
    images: ["https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=800"]
  },
  {
    id: "s premium-sunflower-seeds",
    name: "Organic Kashmiri Sunflower Seeds (High Energy)",
    price: 249,
    originalPrice: 350,
    rating: 4.6,
    category: "Seeds",
    description: "Carefully sorted, raw sunflower seeds loaded with high energy, healthy fats, and rich dietary fibers.",
    images: ["https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=800"]
  },
  {
    id: "s roasted-foxnuts-makhana",
    name: "Premium Himalayan Foxnuts (Roasted Salted Makhana)",
    price: 199,
    originalPrice: 280,
    rating: 4.8,
    category: "Makhana",
    description: "Crispy and light high-protein foxnuts hand-roasted with Himalayan pink salt. An ideal, guilt-free active lifestyle snack.",
    images: ["https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=800"]
  },
  {
    id: "s kashmiri-shahi-healthmix",
    name: "Shahi Kashmiri Almond & Walnut Health Mix",
    price: 699,
    originalPrice: 899,
    rating: 4.9,
    category: "Health Mix",
    description: "Traditional nutritional blend of hand-pounded Mamra Almonds, Kaghzi Walnuts, saffron threads, and cardamom. Perfect with hot milk.",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800"]
  },
  {
    id: "s kashmiri-red-chilli-powder",
    name: "High-Altitude Pure Kashmiri Red Chilli Powder",
    price: 249,
    originalPrice: 320,
    rating: 4.9,
    category: "Spices",
    description: "Direct-sourced high altitude mild red chillies yielding a vibrant crimson color and warm, rich aroma without extreme heat.",
    images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800"]
  },
  {
    id: "s traditional-garlic-pickle",
    name: "Traditional Kashmiri Garlic Pickle (Wild Mountain Honey Blend)",
    price: 299,
    originalPrice: 390,
    rating: 4.7,
    category: "Pickles",
    description: "Traditional recipe of preserved wild garlic cloves cured in raw mustard oil with local aromatic mountain spices.",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800"]
  }
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      let cats: any[] | null = null;
      let matchedCategory: any = null;
      let matchedProducts: any[] = [];

      try {
        const { data } = await supabase.from("categories").select("*");
        cats = data;
        matchedCategory = cats?.find(c => getSlug(c.name) === slug);

        if (matchedCategory) {
          const { data: prods } = await supabase.from("products").select("*").eq("category", matchedCategory.name);
          if (prods && prods.length > 0) matchedProducts = prods;
        }
      } catch (err) {
        console.error("Supabase categories page fetch error:", err);
      }

      // Fallback if category name wasn't matched in db or empty
      if (!matchedCategory) {
        const defaultCategories = [
          { id: "c1", name: "Saffron" },
          { id: "c2", name: "Dry Fruits" },
          { id: "c3", name: "Honey" },
          { id: "c4", name: "Seeds" },
          { id: "c5", name: "Makhana" },
          { id: "c6", name: "Health Mix" },
          { id: "c7", name: "Spices" },
          { id: "c8", name: "Pickles" }
        ];
        matchedCategory = defaultCategories.find(c => getSlug(c.name) === slug);
      }

      // Fallback products if category is matched but table is empty
      if (matchedCategory && matchedProducts.length === 0) {
        matchedProducts = fallbackProducts.filter(p => getSlug(p.category) === slug || p.category === matchedCategory.name);
        // If none matched, just display all fallbacks
        if (matchedProducts.length === 0) {
          matchedProducts = fallbackProducts;
        }
      }

      setCategory(matchedCategory);
      setProducts(matchedProducts);
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 flex-1 w-full pt-32 lg:pt-44 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2E1E] mx-auto"></div>
            <p className="font-serif italic text-sm text-[#0F2E1E]/60">Loading Collection...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-[#0F2E1E] font-serif text-2xl">Premium Collection not found</div>;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-950 font-sans selection:bg-[#FF9933] selection:text-white flex flex-col">
      <Header />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 flex-1 w-full pt-32 lg:pt-44">
        {/* Category Header Spotlights */}
        <div className="mb-12 lg:mb-16 pb-8 border-b border-[#0F2E1E]/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.35em] block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              KASHMIRI SINGLE-ORIGIN SELECTION
            </span>
            <h1 className="text-4xl lg:text-6xl font-serif font-black text-[#0F2E1E] tracking-tight">{category.name}</h1>
            <p className="text-slate-500 text-base lg:text-lg font-light max-w-2xl leading-relaxed">
              Explore our premium collection of authentic Kashmiri {category.name.toLowerCase()}, sustainably sourced directly from certified high altitude native farms.
            </p>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0F2E1E] hover:text-[#FF9933] transition-colors border-b-2 border-emerald-900 pb-1 self-start"
          >
            ← View General Vault
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] opacity-50">
            <Package className="w-16 h-16 mx-auto text-[#0F2E1E]/20 mb-4" />
            <p className="text-xl font-serif font-bold text-[#0F2E1E]">No items currently active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
