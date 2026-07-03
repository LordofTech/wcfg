import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function InventoryShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col pt-24">{children}</main>
      <Footer />
    </>
  );
}
