import { Link } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, subtotal, drawerOpen, setDrawerOpen, updateQuantity, removeItem } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-sm bg-surface h-full shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-lg font-semibold">Your cart</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-ink-soft hover:text-clay"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-ink-soft text-sm py-12 text-center">Your cart is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item._id} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-line flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-ink-soft mb-2">${item.product.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-full border border-line hover:border-clay flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-line hover:border-clay flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-xs text-ink-soft hover:text-clay ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium whitespace-nowrap">
                    ${item.lineTotal.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="block w-full text-center rounded-full bg-ink text-paper py-2.5 font-medium hover:bg-clay transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
