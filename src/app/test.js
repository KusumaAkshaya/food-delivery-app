import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Restaurant } from "@/models/Restaurant";

export async function GET() {
  try {
    await connectDB();

    const restaurants = await Restaurant.find({}).limit(5);

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}