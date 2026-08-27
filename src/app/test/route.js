import { NextResponse } from "next/server";
import { Restaurant } from "../../../backend/model/restaurant";

export async function GET() {
  try {
    const restaurants = await Restaurant.find({}).limit(5);

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Restaurant API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}