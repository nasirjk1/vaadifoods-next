import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-vaadi-green text-vaadi-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          <div className="space-y-6">
            <Link href="/" className="font-serif font-bold text-3xl tracking-tight text-vaadi-cream block mb-4 uppercase">
              VAADI<span className="text-vaadi-gold font-light ml-1">FOODS</span>
            </Link>
            <p className="text-vaadi-cream/70 leading-relaxed font-light pr-4">
              Bringing the authentic, pure, and premium taste of Kashmir directly to your home. Sustainably cultivated, carefully packed.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-widest uppercase mb-8 text-vaadi-gold">Quick Links</h4>
            <ul className="space-y-4 text-vaadi-cream/70 font-light text-sm">
              <li><Link href="/" className="hover:text-vaadi-gold transition-colors block">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-vaadi-gold transition-colors block">Our Story</Link></li>
              <li><Link href="/faq" className="hover:text-vaadi-gold transition-colors block">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-vaadi-gold transition-colors block">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-widest uppercase mb-8 text-vaadi-gold">Get in Touch</h4>
            <ul className="space-y-4 text-vaadi-cream/70 font-light text-sm">
              <li>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hover:text-vaadi-gold transition-colors">WhatsApp Order</a>
              </li>
              <li className="hover:text-vaadi-gold transition-colors cursor-pointer">support@vaadifoods.com</li>
              <li className="leading-relaxed opacity-70 mt-6 text-xs border-l border-vaadi-cream/20 pl-4">
                123 Valley Road, Srinagar<br/>
                Jammu & Kashmir, 190001
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-widest uppercase mb-8 text-vaadi-gold">Social</h4>
            <div className="flex gap-4 mb-12">
              <a href="#" className="w-10 h-10 rounded-full border border-vaadi-cream/20 flex items-center justify-center hover:bg-vaadi-gold hover:border-vaadi-gold hover:text-white transition-all text-xs tracking-widest">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-vaadi-cream/20 flex items-center justify-center hover:bg-vaadi-gold hover:border-vaadi-gold hover:text-white transition-all text-xs tracking-widest">
                FB
              </a>
            </div>
            <p className="text-xs text-vaadi-cream/40 uppercase tracking-widest">
              FSSAI Lic. 10022031000000
            </p>
          </div>

        </div>

        <div className="border-t border-vaadi-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-vaadi-cream/50 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Vaadi Foods. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link href="/privacy-policy" className="hover:text-vaadi-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
