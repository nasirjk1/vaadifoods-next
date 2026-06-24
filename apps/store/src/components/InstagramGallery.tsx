"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, X, ExternalLink, ShieldCheck, HelpCircle } from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: string;
  comments: string;
  caption: string;
  category: string;
  date: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600",
    likes: "1,240",
    comments: "84",
    caption: "Early morning saffron harvest in the high meadows of Pampore, Kashmir. Every flower is handpicked with profound patience.",
    category: "Saffron Fields",
    date: "2 days ago"
  },
  {
    id: "ig-2",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600",
    likes: "892",
    comments: "42",
    caption: "Sunlit bees swarming our high-altitude Acacia meadows. Pure solitary honey in its rawest, sweet state.",
    category: "Meadow Honey",
    date: "1 week ago"
  },
  {
    id: "ig-3",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600",
    likes: "1,539",
    comments: "98",
    caption: "A fresh shipment of Mammra Giri packed securely with natural high oils intact. Absolutely zero bleaching agents used.",
    category: "Organic Nuts",
    date: "5 days ago"
  },
  {
    id: "ig-4",
    imageUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600",
    likes: "2,050",
    comments: "144",
    caption: "Winter sets in over our family-owned walnut plantations in high Kashmir. Nature resting before the majestic spring blossom.",
    category: "Kashmiri Winter",
    date: "3 weeks ago"
  },
  {
    id: "ig-5",
    imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600",
    likes: "740",
    comments: "31",
    caption: "Traditional sun-drying process of local Kaghzi Walnuts. Retaining full fiber density and whole pristine brain halves.",
    category: "Traditional Sun-Curing",
    date: "Yesterday"
  },
  {
    id: "ig-6",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600",
    likes: "1,112",
    comments: "67",
    caption: "Brewing the traditional Kashmiri saffron green tea (Kahwa) in absolute wilderness. Complete with high almonds & green cardamom.",
    category: "High Tea Cult",
    date: "3 days ago"
  }
];

export default function InstagramGallery() {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  return (
    <div id="instagram-gallery-root" className="space-y-12">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div id="gallery-header-info" className="text-center md:text-left space-y-2">
          <span className="text-[#FF9933] font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center md:justify-start gap-2">
            <Instagram className="w-4 h-4 text-[#FF9933]" /> GALLERY ARCHIVES
          </span>
          <h3 className="font-serif text-3xl font-black text-[#0F2E1E]">
            Follow Our Journey
          </h3>
          <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl">
            Our Instagram timeline is a window into the beautiful fields, local farmers, quality checkpoints, and traditional harvesting families.
          </p>
        </div>
        
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white hover:bg-[#0F2E1E] text-[#0F2E1E] hover:text-[#FAF7F0] border-2 border-[#0F2E1E] px-8 py-3.5 font-bold text-xs uppercase tracking-widest transition-all rounded-full flex items-center gap-2"
        >
          @vaadifoods <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Grid Layout */}
      <div id="ig-photos-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {INSTAGRAM_POSTS.map((post) => (
          <div 
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square bg-slate-100 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Post Image */}
            <Image 
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />

            {/* Hover Mask Panel */}
            <div className="absolute inset-0 bg-[#0F2E1E]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 text-white p-3 text-center">
              <Instagram className="w-6 h-6 text-[#FF9933] mb-2 transform scale-75 group-hover:scale-100 transition-transform duration-500" />
              <div className="flex items-center gap-4 text-xs font-bold font-sans">
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 fill-[#FF9933] text-[#FF9933]" /> {post.likes}</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 fill-white text-white" /> {post.comments}</span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#FF9933] mt-2 block">
                {post.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal Viewer */}
      {selectedPost && (
        <div 
          id="ig-post-modal" 
          className="fixed inset-0 z-50 bg-[#0F2E1E]/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-[#FAF7F0] w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row relative animate-[scale-in_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-[#FF9933] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Section */}
            <div className="relative w-full md:w-[55%] aspect-square md:aspect-auto md:h-[550px] bg-slate-900 border-b md:border-b-0 md:border-r border-slate-100">
              <Image 
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 550px"
              />
            </div>

            {/* Modal Details Section */}
            <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col justify-between bg-white h-auto md:h-[550px]">
              <div className="space-y-6">
                {/* Header author tag */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F2E1E] flex items-center justify-center text-[#FF9933] font-bold">
                      VF
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-black text-[#0F2E1E]">vaadifoods</h4>
                      <p className="text-[10px] text-[#FF9933] font-bold tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Direct Verified Partner
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caption / Details */}
                <div className="space-y-4">
                  <span className="text-[10px] bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/25 font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full inline-block">
                    {selectedPost.category}
                  </span>
                  <p className="text-slate-600 font-light text-xs md:text-sm leading-relaxed">
                    {selectedPost.caption}
                  </p>
                </div>
              </div>

              {/* Engagement Stats footer */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#0F2E1E]"><Heart className="w-5 h-5 fill-[#FF9933] text-[#FF9933]" /> {selectedPost.likes} Likes</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><MessageCircle className="w-5 h-5" /> {selectedPost.comments} Comments</span>
                  </div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{selectedPost.date}</span>
                </div>

                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-center py-4 rounded-2xl bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-black text-xs uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  View on Instagram <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
