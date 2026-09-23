import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Masters } from "@/components/Masters";
import { Location } from "@/components/Location";
import { Reviews } from "@/components/Reviews";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-clip">
        <div className="relative flex min-h-[100svh] flex-col">
          <Hero />
          <div className="mt-auto shrink-0">
            <Marquee />
          </div>
        </div>
        <Services />
        <About />
        <Masters />
        <Location />
        <Reviews />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
