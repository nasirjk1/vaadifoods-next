"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Upload, Trash, File } from "lucide-react";

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data } = await supabase.storage.from("product-images").list();
    if (data) {
      setFiles(data.filter(f => f.name !== ".emptyFolderPlaceholder"));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vaadi-green tracking-tight">Media <span className="text-vaadi-gold font-light">Library</span></h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-medium">Manage product images and assets</p>
        </div>
        <button className="bg-vaadi-green hover:bg-vaadi-green/90 text-white px-5 py-2.5 rounded-md text-sm font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Files
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6 min-h-[500px]">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-md bg-slate-50">
             <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
             <p className="text-slate-500 font-medium">No media files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
             {files.map((file, i) => (
                <div key={i} className="group relative aspect-square rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                   {file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".webp") || file.name.endsWith(".jpeg") ? (
                      <img 
                        src={`https://mvqinjgldo6c6vxj5c2q7g.supabase.co/storage/v1/object/public/product-images/${file.name}`} 
                        alt={file.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                   ) : (
                      <File className="w-8 h-8 text-slate-400" />
                   )}
                   <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <p className="text-xs text-white truncate max-w-full font-medium" title={file.name}>{file.name}</p>
                      <button className="self-end w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600">
                         <Trash className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
