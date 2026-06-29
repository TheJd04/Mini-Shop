import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setSubtotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch {
      // silently ignore — cart will just appear empty
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Log in to add items to your cart');
      return false;
    }
    try {
      const { data } = await api.post('/cart/items', { productId, quantity });
      setItems(data.items);
      setSubtotal(data.subtotal);
      setDrawerOpen(true);
      toast.success('Added to cart');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch {
      toast.error('Could not remove item');
    }
  };

  const clearCart = () => {
    setItems([]);
    setSubtotal(0);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, subtotal, itemCount, loading,
        drawerOpen, setDrawerOpen,
        addToCart, updateQuantity, removeItem, clearCart, refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
