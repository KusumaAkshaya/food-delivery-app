import Restaurant from "../../../backend/model/restaurant.js";
import { haversineDistance } from "../utils/haversine.js";

// Pipeline: get user location → create bounding box → fetch candidates → calculate Haversine distance → filter by radius → sort → return results.

export const getNearbyRestaurants = async (req, res) => {
    try {
        // Get latitude, longitude, and search radius from the frontend.
        const { lat, lng, radius = 5 } = req.query;

        console.log(lat)
        console.log(lng)
        // Validate that required coordinates are present.
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        

        // Convert query parameters from strings to numbers.
        const userLat = Number(lat);
        const userLng = Number(lng);
        const searchRadius = Number(radius);

        // Validate numeric coordinate and radius values.
        if (
            Number.isNaN(userLat) ||
            Number.isNaN(userLng) ||
            Number.isNaN(searchRadius)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid coordinates or radius"
            });
        }

        // Calculate latitude and longitude ranges for the bounding box.
        const latDelta = searchRadius / 111;
        const lonDelta =
            searchRadius /
            (111 * Math.cos((userLat * Math.PI) / 180));

        const minLat = userLat - latDelta;
        const maxLat = userLat + latDelta;
        const minLng = userLng - lonDelta;
        const maxLng = userLng + lonDelta;

        // Fetch only restaurants that fall inside the approximate bounding box.
        const candidates = await Restaurant.find({
      
        });
        // Calculate exact distance, remove restaurants outside the radius, and sort by nearest first.
        const nearbyRestaurants = candidates
            .map((restaurant) => {
                const distance = haversineDistance(
                    userLat,
                    userLng,
                    Number(restaurant.Latitude),
                    Number(restaurant.Longitude)
                );
                console.log(distance)
                return {
                    ...restaurant.toObject(),
                    distance: Number(distance.toFixed(2))
                };
            })
            .filter((restaurant) => restaurant.distance <= searchRadius)
            .sort((a, b) => a.distance - b.distance)
            
        // Send the nearby restaurants back to the frontend.
        return res.status(200).json({
            success: true,
            userLocation: {
                latitude: userLat,
                longitude: userLng
            },
            radius: searchRadius,
            candidatesChecked: candidates.length,
            count: nearbyRestaurants.length,
            restaurants: nearbyRestaurants
        });
    } catch (error) {
        // Handle unexpected database or server errors.
        console.error("Nearby restaurant error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to find nearby restaurants"
        });
    }
};