import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Vaadi Foods",
  description: "Returns and refund policy for Vaadi Foods.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Refund Policy
        </h1>
        <div className="prose prose-lg prose-emerald text-[#1E3A2F]/80">
          <p className="mb-6">
            We take absolute pride in our products. If you are not entirely satisfied with your purchase, we&apos;re here to help.
          </p>
          
          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-10 mb-4">1. Returns</h2>
          <p className="mb-4">Due to the perishable nature of food items, we cannot accept returns once the product has been opened.
            If you received a damaged package or incorrect item, please notify us within 48 hours of delivery.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">2. Refunds</h2>
          <p className="mb-4">Once we receive your notification about a damaged or incorrect item, we will inspect the issue and notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">3. Contact Us</h2>
          <p className="mb-4">To initiate a return or refund for a damaged item, please email us directly at support@vaadifoods.com with images of the package.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
