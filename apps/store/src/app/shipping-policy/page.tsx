import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Vaadi Foods",
  description: "Information about Vaadi Foods shipping and delivery timelines.",
};

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Shipping Policy
        </h1>
        <div className="prose prose-lg prose-emerald text-[#1E3A2F]/80">
          <p className="mb-6">
            We are dedicated to delivering the authentic taste of Kashmir directly to your doorstep with maximum care and speed.
          </p>
          
          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-10 mb-4">1. Order Processing Time</h2>
          <p className="mb-4">All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p className="mb-4">Standard delivery within India typically takes 4-7 business days depending on your location. Delivery to remote areas may take slightly longer.</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Standard Shipping:</strong> Free for orders above ₹1000</li>
            <li><strong>Express Shipping:</strong> Available at an additional cost calculated at checkout</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">3. Packaging</h2>
          <p className="mb-4">All items, especially fragile items and perishables like raw honey and saffron, are securely packed in premium, food-grade materials to ensure they reach you in absolute perfect condition.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
