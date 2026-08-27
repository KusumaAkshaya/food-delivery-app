import Image from "next/image";
import Landing from "./components/landing-page";
import WhatsOnYourMind from "./components/whats-on-your-mind";
import LandingPage from "./components/landing-page";
import Restaurents from "./components/restaurents";
import About from "./components/about";
import Footer from "./components/footer" 
import LoginPage from "./login/page";
import NearbyRestaurants from "./components/nearby";

export default function Home() {
  return (
    <div>
        <LandingPage />
        <WhatsOnYourMind />
        <NearbyRestaurants />
        <About />
        <Footer />
    </div>
  );
}
