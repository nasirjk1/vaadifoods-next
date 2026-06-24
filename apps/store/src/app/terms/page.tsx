import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Vaadi Foods",
  description: "Terms and conditions for using Vaadi Foods.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-lg prose-emerald text-[#1E3A2F]/80">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p className="mb-6">
            Welcome to Vaadi Foods. By using our website, you agree to be bound by the following terms and conditions.
          </p>
          
          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-10 mb-4">1. General Terms</h2>
          <p className="mb-4">By accessing our website, you warrant that you are at least 18 years old or visiting under the supervision of a parent or guardian. We reserve the right to refuse service to anyone for any reason.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">2. Products & Pricing</h2>
          <p className="mb-4">All products are subject to availability. We reserve the right to discontinue any product at any time or change pricing without prior notice. Natural products may vary slightly in appearance or taste depending on the harvest season.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">3. Accuracy of Billing</h2>
          <p className="mb-4">You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
