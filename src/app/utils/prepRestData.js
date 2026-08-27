import fs from "fs"

const rawData = JSON.parse(
  fs.readFileSync("./restaurants_with_menu.json", "utf-8")
);


const cleanedRestaurants = rawData
  .map((restaurant) => ({
    ...restaurant,

    Latitude: Number(restaurant.Latitude),
    Longitude: Number(restaurant.Longitude)
  }))
  .filter((restaurant) =>
    Number.isFinite(restaurant.Latitude) &&
    Number.isFinite(restaurant.Longitude) &&
    restaurant.Latitude >= -90 &&
    restaurant.Latitude <= 90 &&
    restaurant.Longitude >= -180 &&
    restaurant.Longitude <= 180 &&
    !(restaurant.Latitude === 0 && restaurant.Longitude === 0)
  );

fs.writeFileSync(
  "./restaurants_cleaned.json",
  JSON.stringify(cleanedRestaurants, null, 2)
);

console.log("Original:", rawData.length);
console.log("Cleaned:", cleanedRestaurants.length);
console.log("Removed:", rawData.length - cleanedRestaurants.length);