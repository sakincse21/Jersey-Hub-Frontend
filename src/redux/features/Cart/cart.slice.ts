/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import type { IVariant } from '@/pages/AllRoles/Collections';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  variant: IVariant;
  quantity: number;
  stock: number; // Keep track of stock for validation
}

interface CartState {
  items: CartItem[];
}

// Helper to load state from localStorage
const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [] };
    }
    const parsedData = JSON.parse(serializedState);
    // Handle case where stored data is the array itself
    if (Array.isArray(parsedData)) {
      return { items: parsedData };
    }
    // Handle legacy case where the whole state object {items: []} was stored
    if (parsedData && Array.isArray(parsedData.items)) {
      return { items: parsedData.items };
    }
    // Return empty state if format is unrecognized
    return { items: [] };
  } catch (err) {
    return { items: [] };
  }
};

// Helper to save state to localStorage
const saveState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state.items);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'stock'>>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.productId === newItem.productId &&
          item.variant.size === newItem.variant.size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + newItem.quantity;
        if (newQuantity > existingItem.variant.stock) {
            toast.error(`Cannot add more. Only ${existingItem.variant.stock} items in stock.`);
            existingItem.quantity = existingItem.variant.stock;
        } else {
            existingItem.quantity = newQuantity;
            toast.success(`${newItem.quantity} x ${newItem.name} (${newItem.variant.size}) added to cart.`);
        }
      } else {
        state.items.push({ ...newItem, stock: newItem.variant.stock });
        toast.success(`${newItem.quantity} x ${newItem.name} (${newItem.variant.size}) added to cart.`);
      }
      saveState(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; size: string; quantity: number }>) => {
      const { productId, size, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId && item.variant.size === size
      );

      if (existingItem) {
        if (quantity < 1) {
          // If quantity is 0 or less, remove the item
          state.items = state.items.filter(
            (item) => !(item.productId === productId && item.variant.size === size)
          );
        } else if (quantity > existingItem.variant.stock) {
          toast.error(`Only ${existingItem.variant.stock} items are in stock.`);
          existingItem.quantity = existingItem.variant.stock;
        } else {
          existingItem.quantity = quantity;
        }
      }
      saveState(state);
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size: string }>
    ) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.productId === productId && item.variant.size === size)
      );
      saveState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
export const selectTotalCartItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;