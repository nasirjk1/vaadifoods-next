"use client";

import { useEffect, useState, use, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, ChevronLeft, Package, Star, Heart, 
  CheckCircle2, Share2, Truck, ShieldCheck, RefreshCcw, 
  Plus, Minus, Info, ClipboardList, MessageSquare, Leaf, Sparkles, Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart, toggleWishlist, getWishlist, openCartDrawer, WISHLIST_CHANGE_EVENT } from "@/lib/cart-store";

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

const mockReviews = [
  { id: 1, author: "Rahul M.", rating: 5, date: "2 days ago", content: "Absolutely premium quality! The packaging was great and the taste is authentic as promised.", verified: true },
  { id: 2, author: "Sunita K.", rating: 5, date: "1 week ago", content: "Good size and very fresh kernels. Will definitely order again. Fragrant and rich.", verified: true },
  { id: 3, author: "Arjun P.", rating: 5, date: "2 weeks ago", content: "Best find on the internet for Kashmir sourced products. Pure Mongra level filament color releases sweet notes immediately.", verified: true },
];

const TrustSection = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-y border-emerald-950/10 mb-12">
    <div className="flex flex-col items-center text-center gap-3">
      <div className="p-4 bg-white border border-emerald-950/5 rounded-full text-[#FF9933] shadow-sm"><Truck className="w-6 h-6"/></div>
      <div>
        <h4 className="font-bold text-sm lg:text-base font-serif text-[#0F2E1E]">Fast Shipping</h4>
        <p className="text-xs text-slate-500 mt-0.5">Complimentary Above ₹799</p>
      </div>
    </div>
    <div className="flex flex-col items-center text-center gap-3">
      <div className="p-4 bg-white border border-emerald-950/5 rounded-full text-[#FF9933] shadow-sm"><ShieldCheck className="w-6 h-6"/></div>
      <div>
        <h4 className="font-bold text-sm lg:text-base font-serif text-[#0F2E1E]">Secure Payment</h4>
        <p className="text-xs text-slate-500 mt-0.5">UPI, Cards, COD Option</p>
      </div>
    </div>
    <div className="flex flex-col items-center text-center gap-3">
      <div className="p-4 bg-white border border-emerald-950/5 rounded-full text-[#FF9933] shadow-sm"><RefreshCcw className="w-6 h-6"/></div>
      <div>
        <h4 className="font-bold text-sm lg:text-base font-serif text-[#0F2E1E]">Tested Pure</h4>
        <p className="text-xs text-slate-500 mt-0.5">A+++ Lab Specifications</p>
      </div>
    </div>
    <div className="flex flex-col items-center text-center gap-3">
      <div className="p-4 bg-white border border-emerald-950/5 rounded-full text-[#FF9933] shadow-sm"><CheckCircle2 className="w-6 h-6"/></div>
      <div>
        <h4 className="font-bold text-sm lg:text-base font-serif text-[#0F2E1E]">Direct Origin</h4>
        <p className="text-xs text-slate-500 mt-0.5">Jammu & Kashmir Farms</p>
      </div>
    </div>
  </div>
);

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // description, nutrition, reviews
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', payment_method: 'COD' });
  const [processing, setProcessing] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const [addedCheck, setAddedCheck] = useState(false);
  
  // Embla
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [relatedRef, relatedApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setMainImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    supabase.from("products").select("*")
      .then(({ data }) => {
        let found = null;
        if (data) {
          found = data.find((p: any) => getSlug(p.name) === resolvedParams.slug || p.id === resolvedParams.slug);
        }
        
        // Find in fallbacks if not found in db
        if (!found) {
          found = fallbackProducts.find(p => getSlug(p.name) === resolvedParams.slug || p.id === resolvedParams.slug);
        }

        setProduct(found || null);
        
        if (found) {
          const list = data && data.length > 0 ? data : fallbackProducts;
          setRelatedProducts(list.filter(p => p.category === found.category && p.id !== found.id).slice(0, 8));
        }
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!product) return;
    const wishlist = getWishlist();
    setIsWished(wishlist.some(i => i.id === product.id));

    const handleWishChange = (e: any) => {
      const items = e.detail || getWishlist();
      setIsWished(items.some((i: any) => i.id === product.id));
    };

    window.addEventListener(WISHLIST_CHANGE_EVENT, handleWishChange);
    return () => window.removeEventListener(WISHLIST_CHANGE_EVENT, handleWishChange);
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleWishToggle = () => {
    const added = toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]
    });
    setIsWished(added);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0],
      weight: product.category === "Saffron" ? "1g Grade A++" : "500g Premium Shell"
    }, quantity);
    
    setAddedCheck(true);
    setTimeout(() => {
      setAddedCheck(false);
    }, 2000);
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return alert("Please fill all details");
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
        items: [{
          product: { id: product.id, title: product.name, price: product.price },
          quantity: quantity,
          selectedPrice: product.price,
          selectedWeight: "Standard"
        }],
        shippingAddress: {
          fullName: formData.name,
          phone: formData.phone,
          email: "guest@example.com",
          addressLines: formData.address,
          city: "",
          state: "",
          pincode: "",
          country: "India"
        },
        paymentMethod: formData.payment_method,
        paymentStatus: "Pending",
        shippingCost: 0,
        orderStatus: "Pending",
        date: new Date().toISOString().split("T")[0],
        totalAmount: product.price * quantity,
        subtotalAmount: product.price * quantity,
      };

      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      await supabase.from("leads").insert([{ name: formData.name, phone: formData.phone }]);
      
      setShowCheckout(false);
      router.push(`/checkout-success/${orderId}`);
    } catch (err: any) {
      console.error("Quick checkout failed:", err);
      alert("Order could not be saved to Supabase currently: " + (err.message || err));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]"><div className="w-8 h-8 border-4 border-[#0F2E1E] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-[#0F2E1E] font-serif text-2xl">Product not found</div>;

  const discount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tabs = [
    { id: "description", label: "Description", icon: Info },
    { id: "ingredients", label: "Ingredients", icon: Leaf },
    { id: "nutrition", label: "Quality Standards", icon: ClipboardList },
    { id: "shipping", label: "Shipping Options", icon: Truck },
    { id: "reviews", label: `Reviews (${mockReviews.length})`, icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans selection:bg-[#FF9933] selection:text-white pb-20 lg:pb-0">
      <Header />
      <CartDrawer />
      <main className="pt-24 lg:pt-[150px]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
          
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link href="/" className="hover:text-[#FF9933] transition-colors">Home</Link>
            <ChevronLeft className="w-3 h-3 flex-shrink-0" />
            <span className="text-slate-400">{product.category || 'Shop'}</span>
            <ChevronLeft className="w-3 h-3 flex-shrink-0" />
            <span className="text-[#0F2E1E] normal-case tracking-normal">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* LEFT: Gallery (Apple quality image staging) */}
            <div className="lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-32 h-max">
              {/* Main Image Container */}
              <div 
                className="relative aspect-square w-full bg-white rounded-[2.5rem] overflow-hidden cursor-crosshair group shadow-sm border border-slate-100"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {discount > 0 && (
                  <div className="absolute top-6 left-6 z-20 bg-[#FF9933] text-[#0F2E1E] text-xs font-black px-4.5 py-2 rounded-full shadow-lg">
                    {discount}% EXCLUSIVE OFF
                  </div>
                )}
                {product.category === "Saffron" && (
                  <div className="absolute top-6 left-6 z-20 bg-[#0F2E1E] text-[#FAF7F0] text-[10px] font-black px-4 py-2.5 rounded-full border border-white/10 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> A+++ PAMPORE FILAMENT
                  </div>
                )}
                
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2.5">
                  <button 
                    onClick={handleWishToggle}
                    className="w-11 h-11 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center text-[#0F2E1E] hover:text-red-500 transition-all shadow-md active:scale-95"
                  >
                    <Heart className={`w-5.3 h-5.3 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Product link copied to clipboard!");
                    }}
                    className="w-11 h-11 bg-white/85 backdrop-blur-md rounded-full flex items-center justify-center text-[#0F2E1E] hover:text-[#FF9933] transition-all shadow-md active:scale-95"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Touch Carousel slider */}
                <div className="lg:hidden w-full h-full overflow-hidden" ref={emblaRef}>
                  <div className="flex touch-pan-y h-full">
                    {product.images?.length > 0 ? product.images?.map((img: string, i: number) => (
                      <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                        <Image src={img} alt="" fill sizes="100vw" className="object-cover" priority />
                      </div>
                    )) : (
                      <div className="flex-[0_0_100%] min-w-0 relative h-full bg-[#FAF7F0] flex items-center justify-center">
                        <Package className="w-20 h-20 text-[#0F2E1E]/10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Zoom Visual Canvas */}
                <div className="hidden lg:block w-full h-full">
                  {product.images?.[mainImageIndex] ? (
                    <>
                      <Image 
                        src={product.images[mainImageIndex]} 
                        alt="" fill sizes="50vw" 
                        className={`object-cover transition-transform duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`} 
                        priority
                      />
                      {isZoomed && (
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${product.images[mainImageIndex]})`,
                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                            backgroundSize: '200%',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#FAF7F0] flex items-center justify-center">
                      <Package className="w-20 h-20 text-[#0F2E1E]/10" />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails list */}
              {product.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {product.images.map((img: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        setMainImageIndex(i);
                        if(emblaApi) emblaApi.scrollTo(i);
                      }}
                      className={`relative w-22 h-22 rounded-2xl overflow-hidden flex-shrink-0 snap-center border-2 transition-all duration-300 ${mainImageIndex === i ? 'border-[#FF9933] shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info details */}
            <div className="lg:w-1/2 flex flex-col lg:py-2">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-4 py-1.5 bg-[#0F2E1E]/5 text-[#0F2E1E] text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-emerald-950/10">
                  {product.category || 'Collection'}
                </span>
                <div className="flex items-center gap-1 text-[#FF9933] px-3 py-1.5 bg-white border border-emerald-950/5 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-black text-[#0F2E1E]">{product.rating || "4.9"}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 px-3 py-1.5 uppercase tracking-widest bg-emerald-50 rounded-full flex items-center gap-1.5 border border-emerald-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  IN STOCK
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-black text-[#0F2E1E] leading-[1.15] mb-6 tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-col gap-1 mb-8 border-b border-emerald-950/5 pb-8">
                <div className="flex items-end gap-3.5 font-serif">
                  <span className="text-4xl lg:text-5xl font-black text-[#0F2E1E]">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-2xl text-slate-400 line-through pb-1">₹{product.originalPrice}</span>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mt-2">inclusive of all custom taxes and farm levies.</span>
              </div>

              {/* Purchase Section Cards */}
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-150 mb-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold font-serif text-lg text-[#0F2E1E] block">Select Quantity</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#FF9933] font-bold">Standard secure glass jars</span>
                  </div>
                  <div className="flex items-center bg-[#FAF7F0] border border-emerald-950/5 rounded-full shadow-inner">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-slate-500 hover:text-[#0F2E1E] transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center font-serif font-black text-xl text-[#0F2E1E]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-slate-500 hover:text-[#0F2E1E] transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart} 
                    className={`flex items-center justify-center gap-2.5 w-full py-5 border rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm ${
                      addedCheck 
                        ? 'bg-emerald-800 border-emerald-800 text-white' 
                        : 'border-emerald-950/20 text-[#0F2E1E] bg-[#FAF7F0] hover:bg-white hover:border-[#FF9933] hover:text-[#FF9933]'
                    }`}
                  >
                    {addedCheck ? (
                      <>
                        <Check className="w-4.5 h-4.5" /> Added to Basket!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4.5 h-4.5"/> Add To Cart
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowCheckout(true)} 
                    className="flex items-center justify-center gap-2 w-full py-5 bg-[#0F2E1E] text-[#FAF7F0] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FF9933] hover:text-[#0F2E1E] shadow-xl shadow-slate-900/10 transition-all transform active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    const message = `*Order Inquiry*%0A*Product*: ${product.name}%0A*Quantity*: ${quantity}x%0A*Total Value*: ₹${product.price * quantity}%0A%0AHello, I would like to purchase this from Vaadi Foods!`;
                    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
                  }} 
                  className="flex items-center justify-center gap-2 w-full py-5 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20BE5A] shadow-lg shadow-[#25D366]/20 transition-all transform active:scale-[0.98]"
                >
                  Quick Order via WhatsApp
                </button>
              </div>

              <TrustSection />

              {/* Detail Tabs with elegant animation */}
              <div className="mt-4 border-b border-emerald-950/10 flex gap-6 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-4 font-black whitespace-nowrap uppercase text-[10px] tracking-[0.2em] transition-colors relative ${activeTab === tab.id ? 'text-[#0F2E1E]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon className="w-4 h-4 text-[#FF9933]" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTabOutline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9933]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-8 min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-600 leading-relaxed font-light text-sm md:text-base space-y-4"
                  >
                    {activeTab === 'description' && (
                      <div className="space-y-4">
                        <p className="text-lg font-serif text-[#0F2E1E] font-bold">Nature&apos;s most luxurious blessing.</p>
                        <p className="text-slate-500 font-light">{product.description}</p>
                        <p className="text-slate-500 font-light">Packed straight at the processing house under sterile biological settings. Full inspection audits ensure filaments achieve maximum density levels of key pigments: crocin (colors), picrocrocin (saffron flavor), and safranal (glorious aroma signatures).</p>
                      </div>
                    )}
                    {activeTab === 'ingredients' && (
                      <div className="space-y-4">
                        <p className="text-lg font-serif text-[#0F2E1E] font-bold">100% {product.name}</p>
                        <p className="text-slate-500 font-light">Completely chemical-free. Dried cleanly under direct supervised solar hoods inside the packaging facility to ensure total purity preservation without sand or foreign moisture contact.</p>
                        <div className="p-5 bg-white border border-emerald-100 rounded-2xl flex items-center gap-3">
                          <Leaf className="w-6 h-6 text-[#FF9933]" />
                          <span className="text-xs font-bold uppercase tracking-wide text-[#0F2E1E]">ALLERGEN WARNING: Processed on sterile lines that also package native pine seeds and cashew cores.</span>
                        </div>
                      </div>
                    )}
                    {activeTab === 'nutrition' && (
                      <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                          <div className="p-3.5 bg-white border border-emerald-950/5 rounded-xl mt-1 text-[#FF9933] shadow-sm"><Leaf className="w-5 h-5"/></div>
                          <div>
                            <strong className="block text-[#0F2E1E] font-serif text-lg font-black">Zero Preservative Seal</strong>
                            <span className="text-[#0F2E1E]/70 font-light">Untampered, organic, and directly isolated in local family plantation plots.</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="p-3.5 bg-white border border-emerald-950/5 rounded-xl mt-1 text-[#FF9933] shadow-sm"><ShieldCheck className="w-5 h-5"/></div>
                          <div>
                            <strong className="block text-[#0F2E1E] font-serif text-lg font-black font-serif">Certified Grade (A+++ A grade)</strong>
                            <span className="text-[#0F2E1E]/70 font-light">Passed key high-performance spectrometry audits for color, moisture, and filament intact thickness.</span>
                          </div>
                        </li>
                      </ul>
                    )}
                    {activeTab === 'shipping' && (
                      <div className="space-y-6">
                        <div>
                          <strong className="block text-[#0F2E1E] font-serif text-lg font-black mb-2">Shipping & Delivery</strong>
                          <ul className="list-disc pl-5 space-y-2 font-light">
                            <li>Complimentary Express shipping to any India zip code above basket value of ₹799.</li>
                            <li>Standard dispatch handles in 24 hours. Transit averages 2-4 days across metros.</li>
                            <li>Fully insured shipping. If any packaging damage occurs, a free replacement is dispatched immediately.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-5 py-5 px-7 bg-white border border-emerald-950/5 rounded-[2rem]">
                          <div className="text-4xl font-serif font-black text-[#0F2E1E]">4.9</div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-[#FF9933]">
                              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1E]/60">Based on 145 reviews</span>
                          </div>
                        </div>
                        {mockReviews.map(r => (
                          <div key={r.id} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#0F2E1E] font-serif">{r.author}</span>
                                {r.verified && <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> VERIFIED BUYER</span>}
                              </div>
                              <span className="text-xs text-slate-400">{r.date}</span>
                            </div>
                            <div className="flex text-[#FF9933]">
                              {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                            <p className="text-sm text-slate-600 font-light leading-relaxed">&ldquo;{r.content}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pb-12 border-t border-emerald-950/10 pt-16">
              <div className="flex items-end justify-between mb-10">
                <div className="space-y-2">
                  <span className="text-[#FF9933] font-black uppercase text-xs tracking-widest">COMPLIMENT SELECTIONS</span>
                  <h2 className="text-3xl font-serif font-black text-[#0F2E1E]">You may also appreciate</h2>
                </div>
                <div className="hidden sm:flex gap-2">
                  <button onClick={() => relatedApi?.scrollPrev()} className="w-11 h-11 rounded-full border border-emerald-950/10 flex items-center justify-center text-[#0F2E1E] hover:bg-white hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"><ChevronLeft className="w-5.5 h-5.5"/></button>
                  <button onClick={() => relatedApi?.scrollNext()} className="w-11 h-11 rounded-full border border-emerald-950/10 flex items-center justify-center text-[#0F2E1E] hover:bg-white hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"><ChevronLeft className="w-5.5 h-5.5 rotate-180"/></button>
                </div>
              </div>

              <div className="overflow-hidden" ref={relatedRef}>
                <div className="flex touch-pan-y gap-6 pr-8">
                  {relatedProducts.map(rp => (
                    <Link href={`/product/${getSlug(rp.name)}`} key={rp.id} className="flex-[0_0_80%] sm:flex-[0_0_42%] lg:flex-[0_0_28%] min-w-0 group relative cursor-pointer">
                      <div className="aspect-[4/5] bg-white border border-slate-100 rounded-[2rem] overflow-hidden mb-4 relative shadow-sm hover:shadow-lg transition-shadow">
                        {rp.images?.[0] ? (
                          <Image src={rp.images[0]} alt="" fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                        ) : null}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 shadow-sm text-vaadi-green hover:text-vaadi-gold">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="font-black text-[#0F2E1E] font-serif leading-tight mb-2 group-hover:text-[#FF9933] transition-colors text-lg truncate pr-4">{rp.name}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="font-bold text-[#0F2E1E]">₹{rp.price}</span>
                        {rp.originalPrice && rp.originalPrice > rp.price && (
                          <span className="text-xs text-slate-400 line-through">₹{rp.originalPrice}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />

      {/* Checkout Modal Form */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-[#0F2E1E]/75 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAF7F0] rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-emerald-950/20"
            >
              <div className="p-8 overflow-y-auto">
                <h3 className="text-3xl font-serif font-black mb-2 text-[#0F2E1E]">Complete Purchase</h3>
                <p className="text-sm text-slate-500 mb-6 font-light">You are transacting for {quantity}x of {product.name}</p>
                
                <form onSubmit={handleBuy} className="flex flex-col gap-4">
                  <input required placeholder="Full Name" className="p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] rounded-xl outline-none transition-colors font-medium text-slate-800 text-sm shadow-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="WhatsApp Phone Number" type="tel" className="p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] rounded-xl outline-none transition-colors font-medium text-slate-800 text-sm shadow-sm" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <textarea required placeholder="Full Delivery Address" className="p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] rounded-xl outline-none transition-colors h-24 resize-none font-medium text-slate-800 text-sm shadow-sm" onChange={e => setFormData({...formData, address: e.target.value})} />
                  <select required className="p-4 bg-white border border-emerald-950/10 focus:border-[#FF9933] rounded-xl outline-none transition-colors font-medium text-slate-800 text-sm shadow-sm" onChange={e => setFormData({...formData, payment_method: e.target.value})}>
                    <option value="COD">Cash on Delivery</option>
                    <option value="Razorpay">Razorpay / UPI Payment QR</option>
                  </select>
                  
                  <div className="pt-6 border-t border-emerald-950/10 mt-2">
                    <div className="flex justify-between items-center mb-1 text-slate-500 text-sm">
                      <span>Items ({quantity}x)</span>
                      <span>₹{product.price * quantity}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-slate-500 text-sm">
                      <span>Comp Express Shipping</span>
                      <span className="text-green-700 font-black uppercase tracking-widest text-[9px] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#0F2E1E] uppercase tracking-widest text-xs">Grand Total</span>
                      <span className="font-serif font-black text-3xl text-[#0F2E1E]">₹{product.price * quantity}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 py-4 bg-white border border-emerald-950/10 text-[#0F2E1E] rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={processing} className="flex-[2] py-4 bg-[#0F2E1E] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#FF9933] hover:text-[#0F2E1E] transition-colors shadow-lg">
                      {processing ? 'Confirming...' : 'Place Order via WA'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
