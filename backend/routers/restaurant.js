import express from "express";

import {
    getNearbyRestaurants
} from "../../src/app/controllers/restaurantCont.js";

const router = express.Router();

router.get(
    "/nearby",
    getNearbyRestaurants
);

export default router;