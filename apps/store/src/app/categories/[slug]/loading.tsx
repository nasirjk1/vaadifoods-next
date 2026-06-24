import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <header className="border-b border-[#1E3A2F]/10 sticky top-0 bg-[#F8F5EF]/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8 text-[#1E3A2F]/20">
            <ChevronLeft className="w-6 h-6"/>
            <div className="w-40 h-8 bg-[#1E3A2F]/10 rounded animate-pulse lg:hidden"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-[#1E3A2F]/10 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-[#1E3A2F]/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 flex-1 w-full">
        <div className="mb-12 lg:mb-16 pb-8 border-b border-[#1E3A2F]/10">
          <div className="w-64 lg:w-96 h-14 bg-[#1E3A2F]/10 rounded animate-pulse mb-6"></div>
          <div className="w-3/4 max-w-2xl h-6 bg-[#1E3A2F]/10 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i}>
              <div className="aspect-[3/4] bg-[#1E3A2F]/10 rounded-2xl mb-5 animate-pulse"></div>
              <div className="w-1/3 h-4 bg-[#1E3A2F]/10 rounded animate-pulse mb-4"></div>
              <div className="w-3/4 h-6 bg-[#1E3A2F]/10 rounded animate-pulse mb-4"></div>
              <div className="w-1/2 h-8 bg-[#1E3A2F]/10 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
