'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

import SearchBar from "../components/searchBar";
import { 
  addCartItem, 
  getCartItems, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  CartItem 
} from "../utils/cardUtils";
import { dummyDishes } from '../data/data';
import { SearchEngine } from "../utils/searchEngine";

type Dish = {
  name: string;
  image: string;
  price: number;
  description: string;
  rating: number;
  quantity: number;
  restaurant: string;
  restaurantname: string;
  veg: boolean;
  offer: string;
  category: string;
};

type CartMapEntry = { id?: string; quantity: number; restaurant: string };

const searchEngine = new SearchEngine(dummyDishes);
const CATEGORIES = ["All", "Biryani", "Pizza", "Chinese", "South Indian", "Desserts", "Beverages"];
const getItemKey = (restaurant: string, name: string) => `${restaurant}::${name}`;

export default function SearchData() {
  const searchParam = useSearchParams();
  const query = searchParam.get('query') || '';

  const [message, setMessage] = useState('');
  const [filteredData, setFilteredData] = useState<Dish[]>([]);
  const [applyFilter, setApplyFilter] = useState({ veg: false, buy1get1: false, below250: false, category: '' });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // ---- Cart state ----
  const [cartMap, setCartMap] = useState<Record<string, CartMapEntry>>({});
  const [currentRestaurant, setCurrentRestaurant] = useState<string | null>(null);
  const [pendingItem, setPendingItem] = useState<Dish | null>(null);

  // ---- Progressive rendering ----
  const [batchSize, setBatchSize] = useState(8);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const isLarge = window.innerWidth >= 1024;
    const initial = isLarge ? 15 : 8;
    setBatchSize(initial);
    setVisibleCount(initial);
  }, []);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [filteredData, batchSize]);

  // ---- Filter engine ----
  useEffect(() => {
    let matches = searchEngine.search(query);

    if (applyFilter.veg) matches = matches.filter(d => d.veg);
    if (applyFilter.below250) matches = matches.filter(d => d.price <= 250);
    if (applyFilter.buy1get1) matches = matches.filter(d => d.offer?.toLowerCase().includes('buy1get1'));
    if (applyFilter.category && applyFilter.category !== 'All') {
      matches = matches.filter(d => d.category?.toLowerCase() === applyFilter.category.toLowerCase());
    }

    setFilteredData(matches);
  }, [query, applyFilter]);

  // ---- Auth check ----
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          method: "GET",
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch (e) {
        console.error("auth check failed: ", e);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // ---- Load existing cart on mount ----
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      const items = await getCartItems();
      syncCartState(items);
    })();
  }, [isLoggedIn]);

  const syncCartState = (items: CartItem[]) => {
    const map: Record<string, CartMapEntry> = {};
    items.forEach(ci => {
      map[getItemKey(ci.restaurant, ci.name)] = { id: ci._id, quantity: ci.quantity, restaurant: ci.restaurant };
    });
    setCartMap(map);
    setCurrentRestaurant(items.length ? items[0].restaurant : null);
  };

  const performAdd = async (item: Dish) => {
    const updated = await addCartItem({
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurant: item.restaurant,
      restaurantname: item.restaurantname,
      image: item.image,
    });
    syncCartState(updated);
    setMessage(`Added "${item.name}"`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleAddToCart = (item: Dish) => {
    if (currentRestaurant && currentRestaurant !== item.restaurant) {
      setPendingItem(item);
      return;
    }
    performAdd(item);
  };

  const handleConfirmReplace = async () => {
    if (!pendingItem) return;
    await clearCart();
    await performAdd(pendingItem);
    setPendingItem(null);
  };

  const handleIncrement = async (item: Dish) => {
    const entry = cartMap[getItemKey(item.restaurant, item.name)];
    if (!entry?.id) return;
    const updated = await updateCartItemQuantity(entry.id, entry.quantity + 1);
    syncCartState(updated);
  };

  const handleDecrement = async (item: Dish) => {
    const entry = cartMap[getItemKey(item.restaurant, item.name)];
    if (!entry?.id) return;
    const updated = entry.quantity <= 1
      ? await removeFromCart(entry.id)
      : await updateCartItemQuantity(entry.id, entry.quantity - 1);
    syncCartState(updated);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + batchSize, filteredData.length));
  };

  const visibleData = filteredData.slice(0, visibleCount);
  const totalCartCount = Object.values(cartMap).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="bg-slate-50 min-h-screen text-slate-800 antialiased">
      {/* Navigation (Preserved structure + subtle gray/orange polish) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
          <Link href="/" className="shrink-0 flex items-center">
            <Image src="/logo.jpg" alt="logo" width={120} height={40} className="hidden sm:block object-contain" priority />
            <span className="sm:hidden font-bold text-lg text-slate-900">Food<span className="text-orange-500">App</span></span>
          </Link>

          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link 
              href="/cart" 
              className="relative p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors"
              title="Cart"
            >
              <span className="text-2xl leading-none">🛒</span>
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </Link>
            <Link 
              href="/" 
              className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors text-2xl leading-none"
              title="Home"
            >
              🏠︎
            </Link>
          </div>
        </div>
      </nav>

      {/* Floating Toast Notification */}
      {message && (
        <div className="fixed bottom-5 right-5 bg-slate-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-xs z-50 flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          {message}
        </div>
      )}

      {/* Cart Conflict Replacement Modal */}
      {pendingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mx-auto mb-3">
              ⚠️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Replace items in cart?</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Your cart has dishes from a different restaurant. Would you like to clear it and start fresh with items from{" "}
              <span className="font-semibold text-slate-900">{pendingItem.restaurantname}</span>?
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                type="button"
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                onClick={() => setPendingItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-xs"
                onClick={handleConfirmReplace}
              >
                Replace Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto px-4 py-5">
        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto my-12 shadow-xs">
            <p className="text-sm text-slate-600 mb-3">Please sign in to search and customize your order.</p>
            <Link 
              href="/login" 
              className="inline-block bg-slate-900 hover:bg-orange-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Filters Sidebar (Clean Slate & Orange Theme - In Document Flow) */}
            <aside className="w-full lg:w-60 shrink-0 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span>⚡</span> Filters
                </span>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-slate-400 hover:text-orange-600 transition-colors"
                  onClick={() => setApplyFilter({ veg: false, buy1get1: false, below250: false, category: '' })}
                >
                  Reset all
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-1.5 mb-4">
                <button
                  type="button"
                  onClick={() => setApplyFilter(p => ({ ...p, veg: !p.veg }))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between border ${
                    applyFilter.veg 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 border border-emerald-600 rounded-[2px] flex items-center justify-center">
                      <span className="w-1 h-1 bg-emerald-600 rounded-full" />
                    </span>
                    Veg Only
                  </span>
                  {applyFilter.veg && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setApplyFilter(p => ({ ...p, buy1get1: !p.buy1get1 }))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between border ${
                    applyFilter.buy1get1 
                      ? 'bg-orange-50 border-orange-300 text-orange-800 font-semibold' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>🎉 Buy 1 Get 1 Free</span>
                  {applyFilter.buy1get1 && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setApplyFilter(p => ({ ...p, below250: !p.below250 }))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between border ${
                    applyFilter.below250 
                      ? 'bg-orange-50 border-orange-300 text-orange-800 font-semibold' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>🏷️ Under ₹250</span>
                  {applyFilter.below250 && <span>✓</span>}
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Category</span>
                <div className="flex flex-wrap lg:flex-col gap-1">
                  {CATEGORIES.map(cat => {
                    const active = applyFilter.category === cat || (cat === 'All' && !applyFilter.category);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setApplyFilter(p => ({ ...p, category: cat === 'All' ? '' : cat }))}
                        className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          active 
                            ? 'bg-slate-900 text-orange-400 font-semibold' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Results Grid Area */}
            <section className="flex-1 w-full min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-sm sm:text-base font-bold text-slate-800">
                  {query ? (
                    <>Results for <span className="text-orange-600">&ldquo;{query}&rdquo;</span></>
                  ) : (
                    'All Available Dishes'
                  )}
                </h1>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredData.length} items
                </span>
              </div>

              {filteredData.length > 0 ? (
                <div className="flex flex-col items-center">
                  {/* Responsive Grid: 1 col (base), 2 (sm), 3 (md), 4 (lg), 5 (xl/2xl) */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                    {visibleData.map((item, index) => {
                      const key = getItemKey(item.restaurant, item.name);
                      const entry = cartMap[key];

                      return (
                        <div 
                          key={`${key}-${index}`}
                          className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                          {/* Compact Dish Image */}
                          <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                            <Image
                              src={item.image || '/placeholder-dish.jpg'}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                              loading={index < 4 ? "eager" : "lazy"}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                              {item.offer ? (
                                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                  {item.offer}
                                </span>
                              ) : <span />}

                              {/* Veg / Non-veg symbol badge */}
                              <span className="bg-white/95 p-1 rounded shadow-xs">
                                <span className={`w-2.5 h-2.5 rounded-[2px] border ${item.veg ? 'border-emerald-600' : 'border-rose-600'} flex items-center justify-center`}>
                                  <span className={`w-1 h-1 rounded-full ${item.veg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                </span>
                              </span>
                            </div>

                            {/* Bottom Restaurant Name */}
                            <p className="absolute bottom-1.5 left-2 text-[11px] font-medium text-slate-200 truncate max-w-[90%]">
                              {item.restaurantname}
                            </p>
                          </div>

                          {/* Content Body */}
                          <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                            <div>
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1" title={item.name}>
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 shrink-0">
                                  <span className="text-orange-500">★</span>
                                  <span>{item.rating}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                                {item.description}
                              </p>
                            </div>

                            {/* Price & Quantity Stepper */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                ₹{item.price}
                              </span>

                              {entry && entry.quantity > 0 ? (
                                /* [- QTY +] Stepper (Slate container + orange quantity highlight) */
                                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleDecrement(item)}
                                    className="px-2 py-1 text-slate-700 hover:bg-slate-200 active:bg-orange-500 active:text-white text-xs font-bold transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="px-2 text-xs font-bold text-orange-600 min-w-[20px] text-center">
                                    {entry.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleIncrement(item)}
                                    className="px-2 py-1 text-slate-700 hover:bg-slate-200 active:bg-orange-500 active:text-white text-xs font-bold transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                /* Add Button */
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(item)}
                                  className="bg-slate-900 hover:bg-orange-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                                >
                                  <span>Add</span>
                                  <span className="text-orange-400 font-bold leading-none">+</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredData.length && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="mt-8 mb-4 px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all shadow-2xs"
                    >
                      Load More Dishes ({filteredData.length - visibleCount} remaining)
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-sm mx-auto my-8">
                  <span className="text-3xl block mb-2">🍽️</span>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">No matching dishes</h3>
                  <p className="text-xs text-slate-500 mb-4">Try clearing active filters or searching for another term.</p>
                  <button
                    type="button"
                    onClick={() => setApplyFilter({ veg: false, buy1get1: false, below250: false, category: '' })}
                    className="px-4 py-2 bg-slate-900 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </section>
  );
}