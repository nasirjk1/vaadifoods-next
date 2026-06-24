export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#1E3A2F]">
      <header className="border-b border-[#1E3A2F]/10 sticky top-0 bg-[#F8F5EF]/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="w-6 h-6 bg-[#1E3A2F]/10 rounded animate-pulse lg:hidden"></div>
            <div className="w-32 h-8 bg-[#1E3A2F]/10 rounded animate-pulse"></div>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-16 h-4 bg-[#1E3A2F]/10 rounded animate-pulse"></div>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-6 h-6 bg-[#1E3A2F]/10 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </header>
      
      <main>
        <section className="h-[60vh] lg:h-[80vh] w-full bg-[#1E3A2F]/5 animate-pulse mb-24"></section>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-24 pb-24">
          <section>
            <div className="w-48 h-10 bg-[#1E3A2F]/10 rounded animate-pulse mb-4"></div>
            <div className="w-32 h-6 bg-[#1E3A2F]/10 rounded animate-pulse mb-10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="aspect-[4/5] rounded-[2rem] bg-[#1E3A2F]/10 animate-pulse mb-6"></div>
                  <div className="w-3/4 h-6 bg-[#1E3A2F]/10 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </section>

          <section>
             <div className="w-48 h-10 bg-[#1E3A2F]/10 rounded animate-pulse mb-4"></div>
             <div className="w-32 h-6 bg-[#1E3A2F]/10 rounded animate-pulse mb-10"></div>
            
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
          </section>
        </div>
      </main>
    </div>
  );
}
