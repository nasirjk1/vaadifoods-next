"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Edit, Trash, Plus, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
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
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(e.target.files)) {
      const name = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("products").upload(name, file);
      if (data) {
        const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(name);
        urls.push(publicUrl.publicUrl);
      }
    }
    setFormData({ ...formData, images: [...(formData.images || []), ...urls] });
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r text-sm">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg">Vaadi Admin</div>
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/" className="px-4 py-2 hover:bg-gray-50 rounded-md text-gray-600">Dashboard</Link>
          <Link href="/products" className="px-4 py-2 bg-gray-100 rounded-md font-medium text-black">Products</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <button 
            onClick={() => { setFormData({}); setIsEditing(true); }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border max-w-2xl">
            <h2 className="text-lg font-bold mb-4">{formData.id ? 'Edit' : 'Add'} Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" className="w-full border rounded-md p-2" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded-md p-2 h-20" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input required type="number" className="w-full border rounded-md p-2" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
                <input type="number" className="w-full border rounded-md p-2" value={formData.originalPrice || ''} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full border rounded-md p-2" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input type="number" step="0.1" max="5" className="w-full border rounded-md p-2" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {(formData.images || []).map((img: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-100">
                      <img src={img} alt="Product array" className="object-cover w-full h-full" />
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">{uploading ? 'Wait...' : 'Upload'}</span>
                  </button>
                  <input type="file" ref={fileInputRef} multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-md font-medium text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-medium text-sm">Save Product</button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md" /> : <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-md"><ImageIcon className="w-4 h-4 text-gray-400"/></div>}
                    </td>
                    <td className="px-6 py-3 font-medium">{p.name}</td>
                    <td className="px-6 py-3">{p.category}</td>
                    <td className="px-6 py-3 text-gray-600">₹{p.price}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => { setFormData(p); setIsEditing(true); }} className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-md ml-1"><Trash className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
