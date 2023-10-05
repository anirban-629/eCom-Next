import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Products from "@/components/Products";

export default async function Home() {
  return (
    <main>
      <Banner />
      <Products />
    </main>
  );
}
