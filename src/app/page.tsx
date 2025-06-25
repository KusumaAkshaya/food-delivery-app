import Image from "next/image";
import Landing from "./components/landing-page";
import WhatsOnYourMind from "./components/whats-on-your-mind";
import LandingPage from "./components/landing-page";
import Restaurents from "./components/restaurents";
import About from "./components/about";
import Footer from "./components/footer" 

export default function Home() {
  return (
    <div>
        <LandingPage />
        <WhatsOnYourMind />
        <Restaurents />
        <About />
        <Footer />
    </div>
  );
}
