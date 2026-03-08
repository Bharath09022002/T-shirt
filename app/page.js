import ScrollAnimation from "@/components/ScrollAnimation";
import ProductSections from "@/components/ProductSections";

export default function Home() {
    return (
        <main className="bg-white">
            {/* Hero + Scroll Animation */}
            <ScrollAnimation />

            {/* Product Sections */}
            <ProductSections />
        </main>
    );
}
