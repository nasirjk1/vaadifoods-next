import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Vaadi Foods",
  description: "Get in touch with Vaadi Foods for inquiries, support, or bulk orders.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#1E3A2F]/80">
          <div>
            <p className="text-lg mb-8 font-light">
              We&apos;d love to hear from you. Whether you have a question about our products, need help with an order, or just want to say hello.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#1E3A2F] text-lg mb-1 font-serif">Customer Support</h3>
                <p>Email: support@vaadifoods.com</p>
                <p>WhatsApp/Call: +91 99999 99999</p>
                <p className="text-sm mt-1 text-[#1E3A2F]/60">Mon-Sat, 9AM-6PM</p>
              </div>
              <div>
                <h3 className="font-bold text-[#1E3A2F] text-lg mb-1 font-serif">Corporate Office</h3>
                <p className="leading-relaxed">
                  123 Valley Road, Srinagar<br/>
                  Jammu & Kashmir, 190001<br/>
                  India
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#1E3A2F]/10">
            <h3 className="font-bold text-[#1E3A2F] text-2xl mb-6 font-serif">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border border-[#1E3A2F]/20 rounded-lg p-3 bg-[#F8F5EF]/50 focus:outline-none focus:ring-2 focus:ring-[#D89B2B]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border border-[#1E3A2F]/20 rounded-lg p-3 bg-[#F8F5EF]/50 focus:outline-none focus:ring-2 focus:ring-[#D89B2B]" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={4} className="w-full border border-[#1E3A2F]/20 rounded-lg p-3 bg-[#F8F5EF]/50 focus:outline-none focus:ring-2 focus:ring-[#D89B2B]" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-[#1E3A2F] text-white py-3 rounded-lg font-bold hover:bg-[#D89B2B] transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
