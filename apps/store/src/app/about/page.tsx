import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Vaadi Foods",
  description: "Learn about the story behind Vaadi Foods and our mission to bring authentic Kashmiri goodness to your home.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-20">
        <h1 className="text-4xl lg:text-6xl font-serif font-extrabold text-[#1E3A2F] mb-8">
          Our Story
        </h1>
        <div className="prose prose-lg prose-emerald text-[#1E3A2F]/80">
          <p className="lead text-xl mb-6 font-light">
            Bringing the authentic, pure, and premium taste of Kashmir directly to your home.
          </p>
          <p className="mb-6">
            Vaadi Foods was born out of a profound love for the pristine valleys of Kashmir and its rich, unparalleled agricultural tradition. Our journey began with a simple observation: finding truly authentic, unadulterated Kashmiri products like Saffron, Walnuts, and Raw Honey outside the valley was incredibly difficult.
          </p>
          <p className="mb-6">
            We partner directly with local farmers and producers, ensuring fair trade practices and sustainable cultivation. Every product that bears the Vaadi Foods name represents our commitment to purity, quality, and the rich traditions of Kashmir.
          </p>
          <p>
            From the sun-kissed saffron fields of Pampore to the ancient walnut orchards of Sopore, we bring you the finest crops, carefully graded and hygieneically packed to preserve their natural aroma and nutritional value.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
