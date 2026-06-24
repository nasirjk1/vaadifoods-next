"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  highlight: string;
  comment: string;
  productTag: string;
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Chef Devendra Sharma",
    role: "Executive Indian Chef, The Oberoi Grand",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    rating: 5,
    highlight: "Phenomenal Crocin Saffron Count",
    comment: "The crocin density of Vaadi's Pampore Saffron is unmatched. It delivers a deep-crimson hue and natural fragrance that elevates our culinary dishes. It is the absolute pinnacle of Indian spices.",
    productTag: "Kashmiri Mongra Saffron"
  },
  {
    id: "rev-2",
    name: "Dr. Ananya Rao",
    role: "Ayurvedic Practitioner & Nutritionist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    rating: 5,
    highlight: "Pure High-Oil Rich Mamra Almonds",
    comment: "I recommend Mammra Almonds to all my clients seeking physical and cognitive vitality. Vaadi's Mamra Giri contains exceptional high organic oil content compared to California breeds. They are raw, genuine, and packed without sulfites.",
    productTag: "Mammra Almonds Giri"
  },
  {
    id: "rev-3",
    name: "Karan Bir Singh",
    role: "Gastronomy Columnist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    rating: 5,
    highlight: "Smooth, Crystal Purity Solitary Acacia Honey",
    comment: "This Acacia honey is of exceptional standard. It lists exquisite floral meadow notes, flowing glass-clear. No synthetic syrups, no heating. Direct-from-hive elegance that truly showcases Kashmir's wild, untouched meadows.",
    productTag: "Himalayan White Honey"
  },
  {
    id: "rev-4",
    name: "Sarah Mitchell",
    role: "Premium Foods Importer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    rating: 5,
    highlight: "Spectacular Paper-Shell Walnuts",
    comment: "I have imported premium nuts for fifteen years. Vaadi's Kaghzi walnuts are spectacular—the shells collapse from direct, soft pressure, revealing robust golden kernels. Highly recommended for their transparency and fair trade approach.",
    productTag: "Kaghzi Walnuts"
  }
];

export default function ReviewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div id="reviews-carousel-root" className="relative max-w-5xl mx-auto px-4 md:px-12">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-10 -left-4 text-[#FF9933]/10 dark:text-[#FF9933]/5 pointer-events-none select-none">
        <Quote className="w-24 h-24 stroke-[1]" />
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 bg-white border border-[#0F2E1E]/5 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 group"
            >
              {/* Review Header with Stars & Tag */}
              <div className="space-y-4">
                <div id="star-rating-row" className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF9933] text-[#FF9933]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#FF9933] bg-[#FF9933]/10 border border-[#FF9933]/20 px-3 py-1 rounded-full uppercase">
                    {review.productTag}
                  </span>
                </div>

                <blockquote id="testimonial-quote" className="space-y-3">
                  <h4 className="font-serif text-xl font-bold text-[#0F2E1E] leading-tight group-hover:text-[#FF9933] transition-colors">
                    &ldquo;{review.highlight}&rdquo;
                  </h4>
                  <p className="text-slate-500 font-light text-xs md:text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </blockquote>
              </div>

              {/* Review Author Info */}
              <div id="patron-info-footer" className="flex items-center gap-4 mt-8 border-t border-slate-50 pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF9933]/20">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h5 className="font-serif text-sm font-black text-[#0F2E1E]">
                    {review.name}
                  </h5>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div id="carousel-nav-controls" className="flex justify-center items-center gap-6 mt-12">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-[#0F2E1E] group hover:border-[#0F2E1E] text-[#0F2E1E] hover:text-[#FAF7F0] flex items-center justify-center transition-all shadow-sm"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-[#0F2E1E] group hover:border-[#0F2E1E] text-[#0F2E1E] hover:text-[#FAF7F0] flex items-center justify-center transition-all shadow-sm"
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
