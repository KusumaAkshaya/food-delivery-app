// src/app/data/restaurantData.ts

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  location: string;
  type: 'Veg' | 'Non-Veg' | 'Both';
  rating: number;
}

export const restaurentList: Restaurant[] = [
  {
    id: 1,
    name: 'Spice Hub',
    image: '/images/restaurants/spicehub.jpg',
    location: 'Salt Lake, Kolkata',
    type: 'Both',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Green Delight',
    image: '/images/restaurants/greendelight.jpg',
    location: 'Gariahat, Kolkata',
    type: 'Veg',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Tandoori Junction',
    image: '/images/restaurants/tandoori.jpg',
    location: 'Sector V, Kolkata',
    type: 'Non-Veg',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Curry Leaf',
    image: '/images/restaurants/curryleaf.jpg',
    location: 'New Town, Kolkata',
    type: 'Both',
    rating: 4.0,
  },
  {
    id: 5,
    name: 'Veggie Vibes',
    image: '/images/restaurants/veggievibes.jpg',
    location: 'Howrah, Kolkata',
    type: 'Veg',
    rating: 4.4,
  },
];
