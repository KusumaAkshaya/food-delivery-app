'use client';

import DishCard from './DishCard';

const categories = [
  { label: 'Biryani', image: '/images/biriyani.jpg' },
  { label: 'South Indian', image: '/images/south.jpg' },
  { label: 'North Indian', image: '/images/north.jpg' },
  { label: 'Cake', image: '/images/cake.jpg' },
  { label: 'Rolls', image: '/images/roll.jpg' },
  { label: 'Burger', image: '/images/burger.jpg' },
  { label: 'Pizza', image: '/images/pizza.jpg' },
  { label: 'Dosa', image: '/images/dosa.jpg' },
  { label: 'Salad', image: '/images/salad.jpg' },
  { label: 'Kebab', image: '/images/kebab.jpg' },
  { label: 'Paratha', image: '/images/paratha.jpg' },
  { label: 'Pure Veg', image: '/images/veg.jpg' },
  { label: 'Noodles', image: '/images/noodles.jpg' },
  { label: 'Pasta', image: '/images/pasta.jpg' },
];

export default function DishList()
{
    return(
        <div className="grid grid-rows-2 grid-flow-col gap-8 justify-items-center p-10 overflow-x-scroll" >
           {categories.map((item, index) => 
        (
            <DishCard  image={item.image} label={item.label} key={index} />
        ))}
        </div>
    )
}