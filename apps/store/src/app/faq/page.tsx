import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Vaadi Foods",
  description: "Get answers to common questions about Vaadi Foods products.",
};

export default function FAQ() {
  const faqs = [
    {
      q: "Where do your products come from?",
      a: "All our products are brought directly from local growers and producers across different districts of Jammu and Kashmir, ensuring 100% authenticity and premium quality."
    },
    {
      q: "Is your honey 100% raw and organic?",
      a: "Yes. Our honey is sustainably harvested from the deep forests and high altitudes of Kashmir. It is raw, unfiltered, and retains all natural enzymes and pollens."
    },
    {
      q: "How can I verify the purity of your saffron?",
      a: "Our Premium Mogra Saffron (Grade A1) is carefully tested for coloring strength (crocin) and aroma (safranal). Pure Kashmiri saffron will slowly turn water a rich golden-yellow and never lose its red color instantly."
    },
    {
      q: "How do you package dry fruits to retain freshness?",
      a: "Our dry fruits are packed in vacuum-sealed native protective packaging which ensures moisture locks out entirely, keeping walnuts, almonds, and figs fresh for longer periods."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship across India to ensure the fastest delivery of our fresh products. We are working on establishing correct cold-chain logistics for international shipments."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-12">
          Frequently Asked Questions
        </h1>
        <div className="space-y-8 text-[#1E3A2F]/80">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#1E3A2F]/10">
              <h3 className="text-xl font-bold font-serif text-[#1E3A2F] mb-4">{faq.q}</h3>
              <p className="leading-relaxed font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
