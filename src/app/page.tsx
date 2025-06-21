import Image from "next/image";
import Navbar from "./components/Navbar";
import WhatsOnYourMind from "./components/whats-on-your-mind";

export default function Home() {
  return (
    <div className="h-screen login-div" >
      <Navbar />
      <div className="h-[calc(100vh-105px)] w-full flex flex-col items-center justify-center" style={{backgroundColor : 'rgba(0, 0, 0, 0.4)'}} >
        <h1 className="text-white text-7xl font-bold "  >FoodieExpress</h1>
        <p className="description text-white text-4xl " >Find the best restaurants, cafés and bars in India</p>
         <WhatsOnYourMind />
      </div>
     
    </div>
  );
}
