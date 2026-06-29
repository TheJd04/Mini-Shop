import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', addressLine: '', city: '', postalCode: '', country: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: form });
      clearCart();
      toast.success('Order placed!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place your order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="text-ink-soft mb-4">Your cart is empty.</p>
        <Link to="/" className="text-clay-dark hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display text-2xl font-bold mb-6">Shipping details</h1>
        <p className="text-xs text-ink-soft mb-6 bg-sand rounded-lg px-4 py-3">
          This is a simulated checkout for demo purposes — no real payment is processed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="fullName">Full name</label>
            <input
              id="fullName" name="fullName" required
              value={form.fullName} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="addressLine">Address</label>
            <input
              id="addressLine" name="addressLine" required
              value={form.addressLine} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="city">City</label>
              <input
                id="city" name="city" required
                value={form.city} onChange={handleChange}
                className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="postalCode">Postal code</label>
              <input
                id="postalCode" name="postalCode" required
                value={form.postalCode} onChange={handleChange}
                className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="country">Country</label>
            <input
              id="country" name="country" required
              value={form.country} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-full bg-ink text-paper py-3 font-medium hover:bg-clay transition-colors disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : `Place order — $${subtotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Order summary</h2>
        <ul className="divide-y divide-line border border-line rounded-xl overflow-hidden">
          {items.map((item) => (
            <li key={item._id} className="flex gap-3 p-4">
              <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-ink-soft">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">${item.lineTotal.toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 text-base font-semibold px-1">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
