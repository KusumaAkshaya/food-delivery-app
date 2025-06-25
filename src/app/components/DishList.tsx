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
  { label: 'Chicken', image: '/images/chicken.jpg' },
  { label: 'Salad', image: '/images/salad.jpg' },
  { label: 'Mutton', image: '/images/mutton.jpg' },
  { label: 'Roti', image: '/images/dishes/tr.jpg' },
  { label: 'Veg Biryani', image: '/images/dishes/vb.jpg' },
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