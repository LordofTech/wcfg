import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandShowcase from "@/components/BrandShowcase";
import FeaturedInStock from "@/components/FeaturedInStock";
import InventoryGrid from "@/components/InventoryGrid";
import WhyWCFG from "@/components/WhyWCFG";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <FeaturedInStock />
        <BrandShowcase />
        <InventoryGrid />
        <WhyWCFG />
        <ConsultationForm />
      </main>
      <Footer />
    </>
  );
}
