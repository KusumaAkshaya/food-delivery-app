"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Pipeline: fetch nearby restaurants → show limited cards → cycle dummy images → reveal menu on hover → load more gradually.

const restaurantImages = [
    "/images/restaurants/curryleaf.jpg",
    "/images/restaurants/greendelight.jpg",
    "/images/restaurants/meat-and-more.jpg",
    "/images/restaurants/spicehub.jpg",
    "/images/restaurants/tandoorijunction.jpg",
    "/images/restaurants/veggievibes.jpg",
];

export default function NearbyRestaurants() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(12);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const findNearbyRestaurants = async () => {
        try {
            setLoading(true);
            setError("");

            const latitude = 28.6409469;
            const longitude = 77.2373386;
            const radius = 5;

            const response = await fetch(
                `http://localhost:5000/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to find nearby restaurants"
                );
            }

            setRestaurants(data.restaurants);
            setVisibleCount(12);

            console.log("Nearby restaurants:", data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreRestaurants = () => {
        setVisibleCount((previous) => previous + 8);
    };

    return (
        <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
            {/* Header */}
            <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between">
                <div>
                    <p className="mb-1 text-sm font-medium text-orange-500">
                        Discover nearby
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Restaurants near you
                    </h1>

                    {restaurants.length > 0 && (
                        <p className="mt-2 text-sm text-gray-500 animate-[fadeIn_0.4s_ease-out]">
                            {restaurants.length} restaurants found within 5 km
                        </p>
                    )}
                </div>

                {restaurants.length === 0 && (
                    <button
                        onClick={findNearbyRestaurants}
                        disabled={loading}
                        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Finding...
                            </span>
                        ) : (
                            "Find restaurants"
                        )}
                    </button>
                )}
            </div>

            {/* Loading state — shimmer skeleton */}
            {loading && (
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[390px] overflow-hidden rounded-2xl bg-white shadow-sm opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className="relative h-52 overflow-hidden rounded-t-2xl bg-gray-200">
                                <div className="shimmer absolute inset-0" />
                            </div>

                            <div className="space-y-3 p-5">
                                <div className="relative h-5 w-3/4 overflow-hidden rounded bg-gray-200">
                                    <div className="shimmer absolute inset-0" />
                                </div>
                                <div className="relative h-4 w-1/2 overflow-hidden rounded bg-gray-200">
                                    <div className="shimmer absolute inset-0" />
                                </div>
                                <div className="relative h-4 w-2/3 overflow-hidden rounded bg-gray-200">
                                    <div className="shimmer absolute inset-0" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mx-auto max-w-7xl animate-[fadeInUp_0.3s_ease-out] rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Restaurant grid */}
            {!loading && restaurants.length > 0 && (
                <>
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {restaurants
                            .slice(0, visibleCount)
                            .map((restaurant, index) => {
                                const image =
                                    restaurantImages[
                                        index % restaurantImages.length
                                    ];

                                const menuItems =
                                    restaurant.Menu?.slice(0, 3) || [];

                                return (
                                    <Link
                                        href={`/restaurant/${restaurant._id}`}
                                        key={restaurant._id}
                                        className="group block opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                        style={{
                                            animationDelay: `${
                                                (index % 12) * 60
                                            }ms`,
                                        }}
                                    >
                                        <article className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-[0.3deg] hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-orange-200">
                                            {/* Image */}
                                            <div className="relative h-52 w-full overflow-hidden">
                                                <Image
                                                    src={image}
                                                    alt={
                                                        restaurant[
                                                            "Restaurant Name"
                                                        ] || "Restaurant"
                                                    }
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                                                />

                                                {/* Image gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/70" />

                                                {/* Distance */}
                                                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 shadow transition-transform duration-300 group-hover:-translate-y-1">
                                                    📍{" "}
                                                    {restaurant.distance} km
                                                </div>

                                                {/* Rating */}
                                                <div className="absolute right-3 top-3 rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white shadow transition-transform duration-300 group-hover:scale-110">
                                                    ⭐{" "}
                                                    {restaurant[
                                                        "Aggregate rating"
                                                    ] || "N/A"}
                                                </div>
                                            </div>

                                            {/* Restaurant information */}
                                            <div className="p-4">
                                                <h2 className="truncate text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
                                                    {
                                                        restaurant[
                                                            "Restaurant Name"
                                                        ]
                                                    }
                                                </h2>

                                                <p className="mt-1 truncate text-sm text-gray-500">
                                                    {restaurant.Cuisines ||
                                                        "Various cuisines"}
                                                </p>

                                                <div className="mt-3 flex items-center justify-between text-sm">
                                                    <span className="truncate text-gray-500">
                                                        📍{" "}
                                                        {restaurant.Locality ||
                                                            restaurant.City}
                                                    </span>

                                                    <span className="ml-3 whitespace-nowrap font-medium text-gray-700">
                                                        ₹
                                                        {restaurant[
                                                            "Average Cost for two"
                                                        ] || "--"}{" "}
                                                        for two
                                                    </span>
                                                </div>

                                                <div className="mt-4 border-t border-gray-100 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-400">
                                                            {restaurant.Votes ||
                                                                0}{" "}
                                                            reviews
                                                        </span>

                                                        <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 transition-transform duration-200 group-hover:translate-x-1">
                                                            View restaurant →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover menu overlay */}
                                            {menuItems.length > 0 && (
                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-white/95 p-4 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-500">
                                                        Popular dishes
                                                    </p>

                                                    <div className="space-y-2">
                                                        {menuItems.map(
                                                            (
                                                                item: any,
                                                                menuIndex: number
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        menuIndex
                                                                    }
                                                                    className="flex items-center justify-between gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100"
                                                                    style={{
                                                                        transitionDelay: `${
                                                                            menuIndex *
                                                                            60
                                                                        }ms`,
                                                                    }}
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-sm font-medium text-gray-800">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </p>

                                                                        <p className="truncate text-xs text-gray-400">
                                                                            {item.category ||
                                                                                item.cuisine}
                                                                        </p>
                                                                    </div>

                                                                    <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                                                                        ₹
                                                                        {
                                                                            item.price
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    </Link>
                                );
                            })}
                    </div>

                    {/* Load more */}
                    {visibleCount < restaurants.length && (
                        <div className="mt-10 flex justify-center">
                            <button
                                onClick={loadMoreRestaurants}
                                className="rounded-xl border border-orange-500 bg-white px-7 py-3 text-sm font-semibold text-orange-500 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-orange-50 hover:shadow-md active:scale-95"
                            >
                                Load more restaurants
                            </button>
                        </div>
                    )}

                    {/* Finished */}
                    {visibleCount >= restaurants.length &&
                        restaurants.length > 12 && (
                            <p className="mt-8 animate-[fadeIn_0.4s_ease-out] text-center text-sm text-gray-400">
                                You've explored all nearby restaurants
                            </p>
                        )}
                </>
            )}

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }

                .shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.6),
                        transparent
                    );
                    transform: translateX(-100%);
                    animation: shimmer 1.4s infinite;
                }
            `}</style>
        </section>
    );
}