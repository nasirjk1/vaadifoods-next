import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Vaadi Foods",
  description: "Privacy Policy for Vaadi Foods website and services.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-lg prose-emerald text-[#1E3A2F]/80">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p className="mb-6">
            At Vaadi Foods, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.
          </p>
          
          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-10 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you manually provide us such as your name, email address, phone number, and shipping address when placing an order or registering an account.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">2. How We Use Information</h2>
          <p className="mb-4">We use your personal data primarily to fulfill orders, provide customer support, and improve our services. We may also send promotional emails if you have opted-in.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">3. Data Sharing</h2>
          <p className="mb-4">We do not sell, trade, or rent your personal identification information to others. We may share necessary data with trusted third party shipping providers to complete your deliveries.</p>

          <h2 className="text-2xl font-serif font-bold text-[#1E3A2F] mt-8 mb-4">4. Security</h2>
          <p className="mb-4">We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access or alteration of your personal information.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
