import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <header className="border-b border-[#1E3A2F]/10 sticky top-0 bg-[#F8F5EF]/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8 text-[#1E3A2F]/20">
            <ChevronLeft className="w-6 h-6"/>
            <div className="w-40 h-8 bg-[#1E3A2F]/10 rounded animate-pulse hidden lg:block"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#1E3A2F]/10 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-[#1E3A2F]/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Images Skeleton */}
          <div className="lg:w-1/2">
            <div className="aspect-[4/5] bg-[#1E3A2F]/5 rounded-3xl mb-6 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-[#1E3A2F]/5 rounded-2xl animate-pulse"></div>
              <div className="w-24 h-24 bg-[#1E3A2F]/5 rounded-2xl animate-pulse"></div>
              <div className="w-24 h-24 bg-[#1E3A2F]/5 rounded-2xl animate-pulse"></div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:w-1/2 flex flex-col pt-4 lg:py-8">
            <div className="w-32 h-4 bg-[#1E3A2F]/10 rounded animate-pulse mb-6"></div>
            <div className="w-3/4 h-12 bg-[#1E3A2F]/10 rounded animate-pulse mb-8"></div>
            
            <div className="w-40 h-10 bg-[#1E3A2F]/10 rounded animate-pulse mb-10"></div>

            <div className="space-y-4 mb-10">
              <div className="w-full h-5 bg-[#1E3A2F]/5 rounded animate-pulse"></div>
              <div className="w-full h-5 bg-[#1E3A2F]/5 rounded animate-pulse"></div>
              <div className="w-5/6 h-5 bg-[#1E3A2F]/5 rounded animate-pulse"></div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#1E3A2F]/5 flex flex-col gap-6">
              <div className="w-64 h-6 bg-[#1E3A2F]/10 rounded animate-pulse"></div>
              <div className="flex gap-4">
                <div className="w-1/3 h-16 bg-[#1E3A2F]/5 rounded-2xl animate-pulse"></div>
                <div className="flex-1 h-16 bg-[#1E3A2F]/10 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
