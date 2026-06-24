"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Edit, Trash, Plus, Upload, Image as ImageIcon, Search, GripVertical, Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let exists = false;
      if (formData.id) {
        const { data: existing, error: checkError } = await supabase
          .from("products")
          .select("id")
          .eq("id", formData.id)
          .maybeSingle();
        
        if (checkError) {
          console.error("Check error:", checkError);
        }
        if (existing) {
          exists = true;
        }
      }

      let result;
      if (exists) {
        result = await supabase.from("products").update(formData).eq("id", formData.id);
      } else {
        result = await supabase.from("products").insert([formData]);
      }

      console.log(result);
      if (result.error) {
        alert(result.error.message);
      } else {
        setIsEditing(false);
        setFormData({});
        fetchProducts();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(e.target.files)) {
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const { data, error } = await supabase.storage.from("product-images").upload(name, file).catch(() => supabase.storage.from("products").upload(name, file));
      if (data || !error) {
        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(name);
        urls.push(publicUrl.publicUrl);
      }
    }
    // Limit to 5 images max
    const newImages = [...(formData.images || []), ...urls].slice(0, 5);
    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Products <span className="text-vaadi-gold font-light">Inventory</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage your active catalog</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setFormData({}); setIsEditing(true); }}
            className="flex items-center gap-2 bg-vaadi-green text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-[#184631] transition-colors shadow-sm whitespace-nowrap uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto rounded-md">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-vaadi-green">{formData.id ? 'Edit Product' : 'Create New Product'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Product Name</label>
              <input required type="text" className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Kashmiri Saffron" />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Custom Slug (ID)</label>
              <input required type="text" disabled={!!products.find(p => p.id === formData.id)} className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800 bg-slate-50 disabled:opacity-70" value={formData.id || ''} onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} placeholder="e.g. kashmiri-saffron-1g" />
              <p className="text-[10px] uppercase tracking-wider mt-2 text-slate-400">Unique identifier and URL slug</p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Description</label>
              <textarea required className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all h-32 text-slate-800" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed product description..." />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Selling Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input required type="number" className="w-full border border-slate-200 rounded-md py-3 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} placeholder="999" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Original/MRP Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input type="number" className="w-full border border-slate-200 rounded-md py-3 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.originalPrice || ''} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} placeholder="1299" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Category</label>
              <select required className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800 bg-white" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Star Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} placeholder="4.5" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Stock Quantity</label>
              <input type="number" min="0" className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.qtyInStock || 0} onChange={(e) => setFormData({...formData, qtyInStock: Number(e.target.value)})} placeholder="100" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">SKU</label>
              <input type="text" className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.sku || ''} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="VDF-SAF-1G" />
            </div>
            
            <div className="col-span-1 md:col-span-2 mt-4 pt-8 border-t border-slate-100">
              <h3 className="font-serif font-bold text-xl mb-6 text-vaadi-green">SEO & Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">SEO Title</label>
                  <input type="text" maxLength={60} className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.seoTitle || ''} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} placeholder="Buy Premium Kashmiri Saffron Online" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">SEO Description</label>
                  <textarea maxLength={160} className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all h-20 text-slate-800" value={formData.seoDescription || ''} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} placeholder="Pure organic saffron sourced directly from Pampore..." />
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4 pt-8 border-t border-slate-100">
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Product Images (up to 5)</label>
              <div className="flex gap-4 mb-6 flex-wrap">
                {(formData.images || []).map((img: string, i: number) => (
                  <div key={i} className="relative w-28 h-28 border border-slate-200 rounded-md overflow-hidden bg-slate-50 group">
                    <img src={img} alt="Product array" className="object-cover w-full h-full" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash className="w-5 h-5 text-white mb-1" />
                      <span className="text-[10px] text-white uppercase tracking-wider font-bold">Remove</span>
                    </button>
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
                      {i === 0 ? 'Cover' : i}
                    </div>
                  </div>
                ))}
                {(formData.images || []).length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-vaadi-gold hover:text-vaadi-gold transition-colors">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">{uploading ? 'Wait...' : 'Add Image'}</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>
              
              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Promotional Video URL (optional)</label>
              <input type="text" className="w-full border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all text-slate-800" value={formData.videoUrl || ''} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://youtube.com/..." />
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-slate-200 flex gap-4 justify-end">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-300 text-slate-600 rounded-md font-bold text-sm uppercase tracking-wider hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-3 bg-vaadi-green text-vaadi-gold rounded-md font-bold text-sm uppercase tracking-widest hover:bg-[#184631] transition-colors shadow-sm">Save Product</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vaadi-gold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Total {products.length} Products</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 w-16">Image</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Product details</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Category</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Pricing</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 rounded-md overflow-hidden border border-slate-200 bg-white">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-50 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-300"/></div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 text-sm mb-1">{p.name}</div>
                      <div className="text-[10px] tracking-wider uppercase text-slate-400 font-bold">{p.sku || p.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] uppercase tracking-widest font-bold">{p.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-vaadi-green">₹{p.price}</div>
                      {p.originalPrice && <div className="text-xs text-slate-400 line-through mt-0.5">₹{p.originalPrice}</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setFormData(p); setIsEditing(true); }} className="w-8 h-8 flex items-center justify-center border border-slate-200 text-slate-600 rounded hover:bg-slate-100 hover:text-vaadi-green transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 flex items-center justify-center border border-red-100 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"><Trash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No products found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
