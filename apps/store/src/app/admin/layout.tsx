"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Package, ShoppingCart, LogOut, 
  Settings, Users, Star, BarChart3, Image as ImageIcon, 
  Search, FolderTree
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else {
        setUser(session?.user || null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else {
        setUser(session?.user || null);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-vaadi-charcoal">Loading admin...</div>;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "SEO", href: "/admin/seo", icon: Search },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      <aside className="w-64 bg-white flex flex-col shadow-[1px_0_0_0_#e2e8f0]">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/admin/dashboard" className="font-serif font-bold text-xl text-vaadi-green uppercase tracking-widest">
            Vaadi <span className="text-vaadi-gold font-light">Admin</span>
          </Link>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-100 text-vaadi-green shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-vaadi-green' : 'text-slate-400'}`} /> {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-vaadi-green text-white flex items-center justify-center font-bold text-xs uppercase">
              {user.email?.substring(0, 2)}
            </div>
            <div className="text-xs text-slate-600 font-medium truncate flex-1 leading-tight">
              {user.email}
              <div className="text-[10px] text-slate-400 font-normal uppercase mt-0.5 tracking-wider">Admin User</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
