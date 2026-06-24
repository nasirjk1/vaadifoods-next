// Client-side lightweight Cart and Wishlist manager with localStorage synchronization
"use client";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  weight?: string;
}

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
}

// Custom trigger of state changes using native CustomEvents
const CART_CHANGE_EVENT = "vaadi-cart-change";
const WISHLIST_CHANGE_EVENT = "vaadi-wishlist-change";
const CART_DRAWER_EVENT = "vaadi-cart-drawer";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("vaadi-cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vaadi-cart", JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: cart }));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  // Auto open cart drawer
  openCartDrawer();
}

export function removeFromCart(id: string | number) {
  const cart = getCart();
  const updated = cart.filter(i => i.id !== id);
  saveCart(updated);
}

export function updateCartQuantity(id: string | number, quantity: number) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("vaadi-wishlist") || "[]");
  } catch {
    return [];
  }
}

export function saveWishlist(wishlist: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vaadi-wishlist", JSON.stringify(wishlist));
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT, { detail: wishlist }));
}

export function toggleWishlist(item: WishlistItem): boolean {
  const wishlist = getWishlist();
  const existingIndex = wishlist.findIndex(i => i.id === item.id);
  let added = false;
  
  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
  } else {
    wishlist.push(item);
    added = true;
  }
  saveWishlist(wishlist);
  return added;
}

export function openCartDrawer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_DRAWER_EVENT, { detail: { open: true } }));
}

export function closeCartDrawer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_DRAWER_EVENT, { detail: { open: false } }));
}

export { CART_CHANGE_EVENT, WISHLIST_CHANGE_EVENT, CART_DRAWER_EVENT };
