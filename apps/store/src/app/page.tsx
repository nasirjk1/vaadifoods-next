import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { 
  Star, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Award, 
  HeartHandshake, 
  Clock, 
  CheckCircle, 
  Truck, 
  Lock, 
  ShoppingBag,
  ArrowRight,
  Package,
  Gift,
  Sprout,
  Flame,
  Droplet,
  Heart,
  Sun
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import InstagramGallery from "@/components/InstagramGallery";

export const revalidate = 3600;

const getSlug = (name: string) => name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

const heroBg = "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=1600";

// Featured products
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
    category: "Himalayan Honey",
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
    id: "s kahwa-tea-masala",
    name: "Kashmiri Kahwa Green Tea (Spice & Filament Blend)",
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    category: "Spices & Beverages",
    description: "Traditional spice and saffron green tea blend packed elegantly with green cardamom, saffron threads, almond bits, and cinnamon for a glorious traditional sip.",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800"]
  },
  {
    id: "s dry-apricot-premium",
    name: "Sun-Dried Kashmiri Apricots (High Fiber & Potassium)",
    price: 349,
    originalPrice: 450,
    rating: 4.6,
    category: "Dry Fruits",
    description: "Moist, plump, naturally sun-dried apricot fruits bursting with sweet high-iron richness. Preserved carefully without sulfur dioxide treatment.",
    images: ["https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=800"]
  }
];

function getCategoryImage(c: any) {
  if (!c) return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800";
  if (c.image) return c.image;

  const name = c.name || "";
  const lower = name.toLowerCase();
  if (lower.includes("saffron")) {
    return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800";
  }
  if (lower.includes("dry") && lower.includes("vegetable")) {
    return "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800";
  }
  if (lower.includes("dry") || lower.includes("fruit") || lower.includes("nut") || lower.includes("walnut") || lower.includes("almond") || lower.includes("cashew") || lower.includes("raisin")) {
    return "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800";
  }
  if (lower.includes("honey")) {
    return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800";
  }
  if (lower.includes("seed")) {
    return "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=800";
  }
  if (lower.includes("makhana") || lower.includes("fox") || lower.includes("foxnut")) {
    return "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800";
  }
  if (lower.includes("health") || lower.includes("mix") || lower.includes("blend")) {
    return "https://images.unsplash.com/photo-1543257580-7269da773bf5?q=80&w=800";
  }
  if (lower.includes("spice") || lower.includes("masala") || lower.includes("kahwa")) {
    return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800";
  }
  if (lower.includes("pickle") || lower.includes("achar")) {
    return "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800";
  }
  if (lower.includes("gift") || lower.includes("pack") || lower.includes("box")) {
    return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800";
  }
  return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800";
}

function getCategoryMeta(name: string) {
  const lower = name.toLowerCase();
  
  if (lower.includes("saffron")) {
    return {
      title: "Saffron",
      description: "Authentic Kashmiri Mongra saffron with rich aroma and color.",
      buttonText: "Shop Saffron",
      badge: "Pure Mongra",
      icon: Sparkles,
      iconBg: "bg-indigo-600",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800"
    };
  }
  if (lower.includes("dry") && lower.includes("vegetable")) {
    return {
      title: "Dry Vegetables",
      description: "Carefully dried vegetables preserving natural taste and nutrition.",
      buttonText: "Shop Dry Vegetables",
      badge: "Traditional Cure",
      icon: Leaf,
      iconBg: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800"
    };
  }
  if (lower.includes("dry") || lower.includes("fruit") || lower.includes("nut") || lower.includes("walnut") || lower.includes("almond") || lower.includes("cashew") || lower.includes("raisin")) {
    return {
      title: "Dry Fruits",
      description: "Premium almonds, walnuts, cashews and raisins sourced from trusted farms.",
      buttonText: "Shop Dry Fruits",
      badge: "High Altitude",
      icon: Award,
      iconBg: "bg-emerald-700",
      image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800"
    };
  }
  if (lower.includes("honey")) {
    return {
      title: "Honey",
      description: "Pure natural honey collected from pristine Himalayan regions.",
      buttonText: "Shop Honey",
      badge: "Wild Nectar",
      icon: Droplet,
      iconBg: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800"
    };
  }
  if (lower.includes("seed")) {
    return {
      title: "Seeds",
      description: "Nutritious pumpkin, sunflower and healthy seed varieties.",
      buttonText: "Shop Seeds",
      badge: "Superfoods",
      icon: Sprout,
      iconBg: "bg-green-600",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=800"
    };
  }
  if (lower.includes("makhana") || lower.includes("fox") || lower.includes("foxnut")) {
    return {
      title: "Makhana",
      description: "Premium fox nuts packed with protein and natural crunch.",
      buttonText: "Shop Makhana",
      badge: "Hand Roasted",
      icon: Star,
      iconBg: "bg-amber-600",
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800"
    };
  }
  if (lower.includes("health") || lower.includes("mix") || lower.includes("blend")) {
    return {
      title: "Health Mix",
      description: "Balanced nutrition blends made from premium ingredients.",
      buttonText: "Shop Health Mix",
      badge: "Wellness Blend",
      icon: Heart,
      iconBg: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1543257580-7269da773bf5?q=80&w=800"
    };
  }
  if (lower.includes("spice") || lower.includes("masala") || lower.includes("kahwa")) {
    return {
      title: "Spices",
      description: "Authentic Kashmiri spices for rich flavor and aroma.",
      buttonText: "Shop Spices",
      badge: "Aromatic Masalas",
      icon: Flame,
      iconBg: "bg-red-600",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800"
    };
  }
  if (lower.includes("pickle") || lower.includes("achar")) {
    return {
      title: "Pickles",
      description: "Traditional homemade pickles prepared with quality ingredients.",
      buttonText: "Shop Pickles",
      badge: "Traditional Pickle",
      icon: Sun,
      iconBg: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800"
    };
  }
  if (lower.includes("gift") || lower.includes("pack") || lower.includes("box")) {
    return {
      title: "Gift Packs",
      description: "Premium gifting boxes filled with authentic Kashmiri products.",
      buttonText: "Shop Gift Packs",
      badge: "Special Gift",
      icon: Gift,
      iconBg: "bg-rose-500",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800"
    };
  }
  
  return {
    title: name,
    description: "Authentic Kashmiri single-origin products hand-tested for pure grade.",
    buttonText: `Shop ${name}`,
    badge: "Premium Harvest",
    icon: Package,
    iconBg: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800"
  };
}

export default async function StoreHome() {
  let categories: any[] = [];
  let dbProducts: any[] = [];

  try {
    const [
      { data: categoriesData },
      { data: productsData }
    ] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("products").select("*").order("created_at", { ascending: false })
    ]);
    categories = categoriesData || [];
    dbProducts = productsData || [];
  } catch (err) {
    console.error("Supabase homepage fetch error:", err);
  }

  // Merge products from DB + fallbacks
  const allProducts = dbProducts.length > 0 ? dbProducts : fallbackProducts;

  // Filter only active products
  const activeProducts = allProducts.filter(p => {
    return p.is_active !== false && p.active !== false && p.status !== "inactive" && p.status !== "draft";
  });

  // Best Sellers (sorted by rating, showing top 3)
  const bestSellers = [...activeProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  // New Arrivals (newest 8 products ordered by created_at DESC)
  const newArrivals = [...activeProducts].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 8);

  // Set default categories if database does not contain them
  const displayCategories = categories.length > 0 
    ? categories 
    : [
        { id: "c1", name: "Saffron" },
        { id: "c2", name: "Dry Fruits" },
        { id: "c3", name: "Honey" },
        { id: "c4", name: "Seeds" },
        { id: "c5", name: "Makhana" },
        { id: "c6", name: "Health Mix" },
        { id: "c7", name: "Spices" },
        { id: "c8", name: "Pickles" },
        { id: "c9", name: "Dry Vegetables" },
        { id: "c10", name: "Gift Packs" }
      ];

  const categoriesToRender = [
    { name: "Dry Fruits" },
    { name: "Honey" },
    { name: "Saffron" },
    { name: "Seeds" },
    { name: "Makhana" },
    { name: "Health Mix" },
    { name: "Spices" },
    { name: "Pickles" }
  ];

  const getCategoryLink = (cName: string) => {
    const dbCat = displayCategories.find(cat => cat.name.toLowerCase().includes(cName.toLowerCase()) || cName.toLowerCase().includes(cat.name.toLowerCase()));
    return `/categories/${getSlug(dbCat?.name || cName)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans selection:bg-[#FF9933] selection:text-white">
      <Header />
      <CartDrawer />
      
      <main className="pt-[90px] lg:pt-[140px]">
        
        {/* Large premium Hero Section */}
        <section className="relative min-h-[85vh] w-full bg-[#0F2E1E] overflow-hidden flex items-center justify-center">
          <Image 
            src={heroBg} 
            alt="Pristine Kashmiri Valley Harvesting Saffron & Nuts" 
            fill 
            className="object-cover opacity-25 mix-blend-overlay scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E1E] via-[#0F2E1E]/40 to-[#0F2E1E]/20" />
          
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center py-16 md:py-24">
            <span className="text-[#FF9933] uppercase tracking-[0.3em] font-black text-[10px] md:text-xs mb-6 bg-white/5 border border-white/10 px-5 py-2 rounded-full inline-flex items-center gap-2 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              THE GOLD STANDARD OF KASHMIRI HARVEST
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight mb-8 text-[#FAF7F0] leading-[1.1] drop-shadow-sm">
              Pure Kashmiri<br/>
              <span className="text-[#FF9933] font-light italic">Premium Foods</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-[#FAF7F0]/85 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Sourced directly from high-altitude fields of Kashmir. Pure, untreated Saffron, pristine Himalayan honey, and mineral-dense dried fruits and nuts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mb-14 items-center justify-center">
              <Link 
                href="#products" 
                className="bg-[#FF9933] hover:bg-[#E07A10] text-[#0F2E1E] px-12 py-5 font-black text-xs md:text-sm uppercase tracking-[0.25em] transition-all duration-300 rounded-full shadow-lg shadow-[#FF9933]/20 flex items-center justify-center transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              >
                Shop Now
              </Link>
              <Link 
                href="#categories" 
                className="bg-transparent border border-white/20 hover:bg-white/10 text-[#FAF7F0] px-12 py-5 font-bold text-xs md:text-sm uppercase tracking-[0.25em] transition-all duration-300 rounded-full flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
              >
                Explore Collection
              </Link>
            </div>

            {/* Premium feature bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 px-8 py-4 bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-2xl text-white/90 text-xs md:text-sm font-semibold tracking-wide w-full sm:w-auto">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4.5 h-4.5 text-[#FF9933] shrink-0" /> ✓ 100% Natural Products</span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4.5 h-4.5 text-[#FF9933] shrink-0" /> ✓ Family Owned Business</span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4.5 h-4.5 text-[#FF9933] shrink-0" /> ✓ Lab Tested Quality</span>
            </div>
          </div>
        </section>

        {/* Home body wrapper */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 lg:py-28 space-y-28 md:space-y-40">
          
          {/* Section 1: Featured Collections */}
          <section id="categories" className="scroll-mt-32">
            <div className="text-center md:text-left mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 md:gap-2.5">
                <span className="w-8 h-[1px] bg-[#FF9933]" />
                <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.35em]">OUR COLLECTIONS</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0F2E1E]">Our Collections</h2>
              <p className="text-sm md:text-base text-slate-500 font-light max-w-xl">
                Explore authentic Kashmiri products carefully selected for purity and quality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoriesToRender.map((catInfo, index) => {
                const meta = getCategoryMeta(catInfo.name);
                const CategoryIcon = meta.icon;
                const link = getCategoryLink(catInfo.name);
                
                return (
                  <Link 
                    key={catInfo.name} 
                    prefetch 
                    href={link} 
                    className="group bg-white rounded-[2rem] border border-slate-100 hover:border-[#FF9933]/20 shadow-sm hover:shadow-2xl hover:shadow-[#0F2E1E]/5 transition-all duration-500 flex flex-col overflow-hidden h-full transform hover:-translate-y-1.5"
                  >
                    {/* Category Image */}
                    <div className="relative aspect-[16/10] w-full bg-[#0F2E1E]/5 overflow-hidden">
                      <Image 
                        src={meta.image} 
                        alt={meta.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-[#0F2E1E]/5 group-hover:bg-[#0F2E1E]/0 transition-colors duration-500" />
                    </div>
                    
                    {/* Card Content with Overlapping Badge */}
                    <div className="relative p-6 pt-8 flex flex-col flex-grow">
                      {/* Overlapping Icon Badge */}
                      <div className={`absolute top-0 left-6 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md z-10 ${meta.iconBg}`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      
                      <h3 className="font-serif text-2xl text-[#0F2E1E] font-black group-hover:text-[#FF9933] transition-colors duration-300 mb-2">
                        {meta.title}
                      </h3>
                      
                      <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed mb-4 flex-grow line-clamp-2">
                        {meta.description}
                      </p>
                      
                      <div className="mt-auto">
                        <span className="inline-flex items-center gap-1.5 text-[#FF9933] font-bold text-xs uppercase tracking-wider group-hover:text-[#E07A10] transition-colors duration-300">
                          Shop Now
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Section 2: Best Sellers Section */}
          <section id="products" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-100 pb-8">
              <div className="text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 md:gap-2.5">
                  <span className="w-8 h-[1px] bg-[#FF9933]" />
                  <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.35em]">BEST-SELLING SELECTION</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0F2E1E]">Best Selling Products</h2>
                <p className="text-sm md:text-base text-slate-500 font-light max-w-xl">
                  Premium products that have earned the trust of quality-seeking families nationwide.
                </p>
              </div>
              <Link 
                href="/products" 
                className="self-center md:self-end flex items-center gap-2.5 text-[#0F2E1E] font-black uppercase tracking-[0.2em] text-xs hover:text-[#FF9933] transition-colors border-b-2 border-[#0F2E1E] pb-1 cursor-pointer shrink-0"
              >
                Explore Complete Vault <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Best Sellers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {bestSellers.map((p, i) => (
                <div key={p.id} className="relative">
                  <div className="absolute top-4 left-4 bg-[#FF9933] text-[#0F2E1E] text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full z-10 shadow-sm">
                    Top Patron Choice
                  </div>
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: New Arrivals */}
          <section id="new-arrivals" className="scroll-mt-32">
            <div className="text-center md:text-left mb-16 space-y-3 border-b border-slate-100 pb-8">
              <div className="inline-flex items-center gap-1.5 md:gap-2.5">
                <span className="w-8 h-[1px] bg-[#FF9933]" />
                <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.35em]">NEW ARRIVALS</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0F2E1E]">New Arrivals</h2>
              <p className="text-sm md:text-base text-slate-500 font-light max-w-xl">
                Freshly selected crops from local farmers, sun-dried and packed under state laboratory guidelines.
              </p>
            </div>

            {/* New Arrivals Grid */}
            {newArrivals.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] w-full flex flex-col items-center justify-center shadow-sm">
                <Package className="w-12 h-12 text-[#0F2E1E]/20 mb-4" />
                <p className="text-lg font-serif font-bold text-[#0F2E1E] mb-1">No products available.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto font-light">We are hard at work bringing fresh premium products to the vault. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {newArrivals.map((p, i) => (
                  <div key={p.id} className="relative">
                    <div className="absolute top-4 left-4 bg-[#0F2E1E] text-[#FF9933] text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full z-10 shadow-sm border border-[#FF9933]/20">
                      New Harvest
                    </div>
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Why Choose Vaadi Foods (Deeply Premium Feature Presentation) */}
          <section className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-16 shadow-sm space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.25em]">CERTIFIED SAFE & FAIR</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0F2E1E]">What Defines Vaadi Foods</h2>
              <div className="w-16 h-1 bg-[#FF9933] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-[#FAF7F0]/50 hover:bg-[#FAF7F0] rounded-[2rem] border border-slate-50 hover:border-[#FF9933]/20 transition-all flex flex-col group h-full">
                <div className="w-12 h-12 bg-[#0F2E1E] rounded-2xl flex items-center justify-center text-[#FF9933] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-black text-[#0F2E1E] mb-3">100% Pampore Sourced</h3>
                <p className="text-slate-500 font-light leading-relaxed text-xs md:text-sm">
                  Every thread of saffron comes exclusively from the soil of Pampore, known worldwide for premium saffron.
                </p>
              </div>

              <div className="p-8 bg-[#FAF7F0]/50 hover:bg-[#FAF7F0] rounded-[2rem] border border-slate-50 hover:border-[#FF9933]/20 transition-all flex flex-col group h-full">
                <div className="w-12 h-12 bg-[#0F2E1E] rounded-2xl flex items-center justify-center text-[#FF9933] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-black text-[#0F2E1E] mb-3">Zero Artificial Infusions</h3>
                <p className="text-slate-500 font-light leading-relaxed text-xs md:text-sm">
                  Absolutely no preservatives, food dye coating, or moisture sprays. Raw and untreated preservation at its absolute best.
                </p>
              </div>

              <div className="p-8 bg-[#FAF7F0]/50 hover:bg-[#FAF7F0] rounded-[2rem] border border-slate-50 hover:border-[#FF9933]/20 transition-all flex flex-col group h-full">
                <div className="w-12 h-12 bg-[#0F2E1E] rounded-2xl flex items-center justify-center text-[#FF9933] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-black text-[#0F2E1E] mb-3">Direct-to-Farmer Tariffs</h3>
                <p className="text-slate-500 font-light leading-relaxed text-xs md:text-sm">
                  We bridge the grower and you directly. Skip commission merchants entirely, returning fair livable pricing to Kashmiri farmers.
                </p>
              </div>

              <div className="p-8 bg-[#FAF7F0]/50 hover:bg-[#FAF7F0] rounded-[2rem] border border-slate-50 hover:border-[#FF9933]/20 transition-all flex flex-col group h-full">
                <div className="w-12 h-12 bg-[#0F2E1E] rounded-2xl flex items-center justify-center text-[#FF9933] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-black text-[#0F2E1E] mb-3">Certified Lab Testing</h3>
                <p className="text-slate-500 font-light leading-relaxed text-xs md:text-sm">
                  State lab tested verifying active crocin levels, preserving genuine medicinal and health qualities in every pack.
                </p>
              </div>
            </div>
          </section>

          {/* Majestic Brand Philosophy Accent (Srinagar Meadow Landscape) */}
          <section className="bg-[#0F2E1E] text-[#FAF7F0] rounded-[3rem] py-20 px-8 lg:px-24 relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF9933]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10 max-w-6xl mx-auto">
              <div className="space-y-8 lg:col-span-7">
                <span className="text-[#FF9933] uppercase tracking-[0.3em] font-black text-xs block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-max">
                  OUR SACRED VALES
                </span>
                <h2 className="text-4xl lg:text-6xl font-serif font-black leading-[1.1] tracking-tight">
                  Authentic traditions.<br/>Harvested in Srinagar, Kashmir.
                </h2>
                <p className="text-[#FAF7F0]/85 text-base lg:text-lg leading-relaxed font-light">
                  Our operations are rooted deep in the valleys of Kashmir. Working on high altitude soils, our picking families follow rigorous traditions of sun-drying and zero added chemicals. No color coating, no spray additives — just pristine harvest exactly the way nature nurtured it over decades.
                </p>
                
                <div className="pt-8 flex gap-12 border-t border-white/10">
                  <div>
                    <div className="text-4xl lg:text-5xl font-serif font-black text-[#FF9933] mb-1">A+++</div>
                    <div className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FAF7F0]/60">Mongra Certification</div>
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-serif font-black text-[#FF9933] mb-1">100%</div>
                    <div className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FAF7F0]/60">Pure</div>
                  </div>
                  <div>
                    <div className="text-4xl lg:text-5xl font-serif font-black text-[#FF9933] mb-1">Zero</div>
                    <div className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FAF7F0]/60">Artificial Infusions</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block relative aspect-[4/5] overflow-hidden lg:col-span-5 rounded-[2rem] border border-white/15 p-4 bg-white/[0.03] backdrop-blur-md">
                <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800" 
                    alt="Purity harvest" 
                    fill 
                    className="object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 bg-[#0F2E1E]/30 mix-blend-multiply" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Customer Reviews carousel */}
          <section id="reviews">
            <div className="text-center space-y-3 mb-16">
              <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.35em]">VERIFIED CUSTOMERS</span>
              <h2 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#0F2E1E]">Customer Reviews</h2>
              <div className="w-20 h-1 bg-[#FF9933] mx-auto mt-4 rounded-full" />
            </div>

            <ReviewsCarousel />
          </section>

          {/* Section 6: Instagram Gallery */}
          <section id="instagram-feed" className="pt-8">
            <InstagramGallery />
          </section>

        </div>
      </main>

      {/* Section 7: Premium Footer */}
      <Footer />
    </div>
  );
}