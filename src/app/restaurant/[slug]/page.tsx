'use client'

import { useParams } from 'next/navigation'
import { dummyDishes } from '@/app/data/data'
import { restaurentList } from '@/app/data/restaurentData'
import Image from 'next/image'

export default function RestaurantDetail() {
  const { slug } = useParams();
  const restaurantName = slug?.toString().toLowerCase();

  const restaurantInfo = restaurentList.find(
    r => r.name.toLowerCase().replace(/\s+/g, '') === restaurantName
  );

  const dishes = dummyDishes.filter(
    d => d.restaurant.toLowerCase() === restaurantName
  );

  if (!restaurantInfo) {
    return <p className="p-10 text-red-500">Restaurant not found.</p>;
  }

  return (
    <div className="p-10 bg-gray-50 ">
      <div className="flex flex-col md:flex-row items-center gap-10 mb-10 bg-orange-100 p-6 rounded shadow">
        <Image src={restaurantInfo.image} alt={restaurantInfo.name} width={300} height={200} className="rounded-lg object-cover" />
        <div>
          <h2 className="text-4xl text-orange-500 font-bold libre-baskerville-regular-italic">{restaurantInfo.name}</h2>
          <p> {restaurantInfo.type}</p>
          <p>📍{restaurantInfo.location}</p>
          <p>⭐ {restaurantInfo.rating}</p>
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-4">Menu</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dishes.map((dish, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md flex sm:flex-col sm:max-w-120">
            <div className="w-1/2 sm:w-full" >
            <Image src={dish.image} alt={dish.name} width={300} height={200} className="rounded w-full h-40 object-cover" />
            </div>
            <div className="h-full flex flex-col justify-center ml-2 text-2xl" >
            <h4 className=" sm:text-lg font-bold mt-2 text-orange-500 caveat">{dish.name}</h4>
            <p className="text-sm opacity-70">{dish.description}</p>
            <div className="flex justify-between mt-2">
              <span>₹{dish.price}</span>
              <span>⭐{dish.rating}</span>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
