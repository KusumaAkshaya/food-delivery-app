import Navbar from "./Navbar";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col login-div" >
      <Navbar />
      <div className="h-[calc(100vh-105px)] w-full flex flex-col items-center justify-center" style={{backgroundColor : 'rgba(0, 0, 0, 0.4)'}} >
        <h1 className="text-white md:text-5xl text-7xl font-bold "  >FoodieExpress</h1>
        <p className="description text-white text-4xl " >Find the best restaurants, cafés and bars in India</p>
      </div>
    </div>
  );
}