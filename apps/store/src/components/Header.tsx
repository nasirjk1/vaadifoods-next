"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, User, Heart, ChevronDown, Sparkles, X } from "lucide-react";
import { getCart, getWishlist, CART_CHANGE_EVENT, WISHLIST_CHANGE_EVENT, openCartDrawer } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";

const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Honey", href: "/categories/honey" },
  { name: "Dry Fruits", href: "/categories/dry-fruits" },
  { name: "Saffron", href: "/categories/saffron" },
  { name: "Seeds", href: "/categories/seeds" },
  { name: "Makhana", href: "/categories/makhana" },
  { name: "Health Mix", href: "/categories/health-mix" },
  { name: "Spices", href: "/categories/spices" },
  { name: "Pickles", href: "/categories/pickles" },
];

export default function Header() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check initial user auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch categories
    const fetchCats = async () => {
      try {
        const { data } = await supabase.from("categories").select("*");
        if (data) {
          setCategories(data);
        } else {
          setCategories([
            { id: "1", name: "Saffron" },
            { id: "2", name: "Dry Fruits" },
            { id: "3", name: "Acacia Honey" }
          ]);
        }
      } catch {
        setCategories([
          { id: "1", name: "Saffron" },
          { id: "2", name: "Dry Fruits" },
          { id: "3", name: "Acacia Honey" }
        ]);
      }
    };
    fetchCats();

    // Initial counts
    const cart = getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    setWishlistCount(getWishlist().length);

    // Event listeners
    const handleCartChange = (e: any) => {
      const items = e.detail || getCart();
      setCartCount(items.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };

    const handleWishlistChange = (e: any) => {
      const items = e.detail || getWishlist();
      setWishlistCount(items.length);
    };

    window.addEventListener(CART_CHANGE_EVENT, handleCartChange);
    window.addEventListener(WISHLIST_CHANGE_EVENT, handleWishlistChange);

    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
      window.removeEventListener(WISHLIST_CHANGE_EVENT, handleWishlistChange);
    };
  }, []);

  const getSlug = (name: string) => name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-[90px] lg:h-[140px] bg-[#FAF7F0] border-b border-[#0F2E1E]/10 z-50 flex flex-col justify-between shadow-sm">
        {/* Row 1: Premium Announcement Bar (h-[30px]) */}
        <div className="w-full bg-[#0F2E1E] text-[#FAF7F0] text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] h-[30px] flex items-center justify-center relative select-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1.5 md:gap-3 w-full truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9933] animate-pulse shrink-0" />
            <span className="truncate">Kashmiri Premium Harvest • COMPLIMENTARY EXPRESS SHIPPING ABOVE ₹799</span>
          </div>
        </div>

        {/* Row 2: Main Responsive Navbar (h-[60px] / lg:h-[70px]) */}
        <div className="w-full h-[60px] lg:h-[70px] bg-[#FAF7F0]/95 backdrop-blur-md flex items-center px-4 md:px-8 border-b lg:border-b-0 border-[#0F2E1E]/5">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 md:gap-4">
            
            {/* Left Side: Mobile Menu Button & logo */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-[#0F2E1E] hover:text-[#FF9933] transition-colors focus:outline-none cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 md:w-6 h-6" />
              </button>

              <Link href="/" className="font-serif font-black text-lg md:text-2xl tracking-tight text-[#0F2E1E] uppercase group transition-all shrink-0">
                VAADI<span className="text-[#FF9933] font-light ml-0.5 group-hover:tracking-[0.05em] transition-all duration-500">FOODS</span>
              </Link>
            </div>

            {/* Center: Desktop-only search bar trigger (premium design) */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-auto">
              <button 
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center text-[#0F2E1E]/80 hover:text-[#0F2E1E] transition-all bg-[#0F2E1E]/5 hover:bg-[#0F2E1E]/10 px-5 py-2.5 rounded-full cursor-pointer group"
              >
                <Search className="w-4 h-4 mr-3 text-[#0F2E1E]/50 group-hover:text-[#0F2E1E] transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F2E1E]/60 group-hover:text-[#0F2E1E] transition-all">Search premium collections...</span>
              </button>
            </div>

            {/* Right Side: Account actions and cart */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 text-[#0F2E1E] hover:text-[#FF9933] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => {
                  alert(`My Saved Items (${wishlistCount} saved).`);
                }}
                className="p-1.5 md:p-2 text-[#0F2E1E] hover:text-[#FF9933] transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 md:w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-[#0F2E1E]'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#FF9933] text-[#0F2E1E] text-[8px] flex items-center justify-center font-black rounded-full border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Account Link dynamic based on login state */}
              {user ? (
                <Link 
                  href="/account" 
                  className="p-1.5 md:p-2 text-[#0F2E1E] hover:text-[#FF9933] transition-colors flex items-center gap-1 focus:outline-none"
                  aria-label="My Account"
                >
                  <User className="w-4.5 h-4.5 md:w-5 h-5" />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E] hover:text-[#FF9933]">My Account</span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="p-1.5 md:p-2 text-[#0F2E1E] hover:text-[#FF9933] transition-colors flex items-center gap-1 focus:outline-none"
                  aria-label="Account login/signup"
                >
                  <User className="w-4.5 h-4.5 md:w-5 h-5" />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E] hover:text-[#FF9933]">Login / Signup</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button 
                onClick={() => openCartDrawer()}
                className="flex items-center gap-1.5 bg-[#0F2E1E] hover:bg-[#FF9933]/90 text-[#FAF7F0] hover:text-[#0F2E1E] px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer ml-1 text-xs font-bold uppercase tracking-wider shrink-0 focus:outline-none"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Cart</span>
                <span className="w-4.5 h-4.5 bg-[#FAF7F0] text-[#0F2E1E] text-[9px] flex items-center justify-center font-black rounded-full shadow-sm ml-0.5">
                  {cartCount}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Row 3: Desktop-only Navigation Links (h-[40px]) */}
        <div className="hidden lg:flex w-full h-[40px] bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#0F2E1E]/10 items-center justify-center px-8 relative">
          <nav className="max-w-7xl mx-auto flex items-center justify-center gap-8 h-full">
            {NAVIGATION_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[11px] uppercase tracking-[0.2em] font-black h-full flex items-center relative transition-colors duration-200 cursor-pointer ${
                    active 
                      ? "text-[#FF9933]" 
                      : "text-[#0F2E1E]/80 hover:text-[#FF9933]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span 
                      layoutId="activeHeaderLine" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9933] rounded-full" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Side Slider Mobile Navigation Drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0F2E1E]"
            />

            {/* Content panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#FAF7F0] h-full flex flex-col p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#0F2E1E]/10 pb-4 mb-6">
                <span className="font-serif font-black text-xl tracking-tight text-[#0F2E1E]">VAADI<span className="text-[#FF9933] font-light ml-0.5">FOODS</span></span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-emerald-950/5 hover:bg-emerald-950/10 text-emerald-950 rounded-full transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic search in drawer */}
              <div className="mb-6">
                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center bg-[#0F2E1E]/5 hover:bg-[#0F2E1E]/10 px-4 py-3 rounded-xl cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2.5 text-[#0F2E1E]/50" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0F2E1E]/60">Search collections...</span>
                </div>
              </div>

              {/* Navigation tree */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest text-[#0F2E1E]/40 uppercase mb-2">Shop Collections</h3>
                  <div className="space-y-1.5">
                    {NAVIGATION_LINKS.map((link) => {
                      const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                      return (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-l-2 ${
                            active 
                              ? "bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]" 
                              : "hover:bg-emerald-950/5 text-[#0F2E1E] border-emerald-950/10 hover:border-[#FF9933] hover:text-[#FF9933]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold tracking-widest text-[#0F2E1E]/40 uppercase mb-2">Member Account</h3>
                  <div className="space-y-1.5">
                    {user ? (
                      <Link 
                        href="/account" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-950/5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0F2E1E] transition-all"
                      >
                        <User className="w-4 h-4 text-[#FF9933]" />
                        <span>My Account</span>
                      </Link>
                    ) : (
                      <Link 
                        href="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-950/5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0F2E1E] transition-all"
                      >
                        <User className="w-4 h-4 text-[#FF9933]" />
                        <span>Login / Signup</span>
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        alert(`My Saved Items (${wishlistCount} saved).`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-emerald-950/5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0F2E1E] text-left transition-all cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      <span>Saved items ({wishlistCount})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Brand stamp bar */}
              <div className="mt-auto border-t border-[#0F2E1E]/10 pt-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/40">KASHMIRI PREMIUM SELECTION</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[10000] flex items-start justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-[#0F2E1E]/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="relative w-full max-w-3xl bg-[#FAF7F0] rounded-[2rem] shadow-2xl overflow-hidden mt-12 md:mt-24 border border-emerald-950/20"
            >
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-emerald-950/10">
                <div className="flex-1 flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#FF9933]" />
                  <input 
                    placeholder="Search Kashmiri Mongra Saffron, Mammra Almonds..."
                    className="w-full text-lg font-serif outline-none bg-transparent text-[#0F2E1E] placeholder-[#0F2E1E]/40"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-2 bg-emerald-950/5 hover:bg-emerald-950/10 rounded-full text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recommended searches */}
              <div className="p-6 md:p-8 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2E1E]/60">RECOMMENDED SELECTIONS</span>
                <div className="flex flex-wrap gap-2.5">
                  {["Saffron", "Dry Fruits", "Acacia Honey", "Mammra Almonds", "Kaghzi Walnuts", "Ginger Powder"].map((term) => (
                    <button 
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        alert(`Filtering products by "${term}" on the home collection below!`);
                        setSearchOpen(false);
                      }}
                      className="px-4 py-2 bg-white border border-emerald-950/5 rounded-full text-xs font-bold text-[#0F2E1E] hover:border-[#FF9933] hover:bg-[#FF9933]/10 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
