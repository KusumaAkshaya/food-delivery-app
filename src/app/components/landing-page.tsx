import Navbar from "./Navbar";
import SearchBar from "./searchBar";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col login-div" >
      <Navbar />
      <div className="h-[calc(100vh-105px)] w-full flex flex-col items-center justify-center" style={{backgroundColor : 'rgba(0, 0, 0, 0.4)'}} >
        <h1 className="text-white sm:text-4xl md:text-6xl lg:text-7xl text-4xl font-bold "  >FoodieExpress</h1>
        <p className="description text-white sm:text-2xl md:text-4xl text-2xl " >Find the best restaurants, cafés and bars in India</p>
        <div className="flex items-center" ><SearchBar  /> </div>
      </div> 
    </div>
  );
}