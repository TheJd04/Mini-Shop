import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center py-24 text-ink-soft text-sm">Loading…</p>;

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="text-clay mb-4">{error}</p>
        <Link to="/" className="text-clay-dark hover:underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex w-14 h-14 rounded-full bg-sage/15 items-center justify-center mb-4">
          <Check size={24} className="text-sage" strokeWidth={2.5} />
        </span>
        <h1 className="font-display text-2xl font-bold mb-1">Order placed</h1>
        <p className="text-ink-soft text-sm">
          Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="border border-line rounded-xl divide-y divide-line mb-6">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-3 p-4">
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-ink-soft">Qty {item.quantity} × ${item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-base font-semibold mb-8 px-1">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <div className="bg-sand rounded-xl p-5 mb-8">
        <p className="text-xs uppercase tracking-wide text-ink-soft mb-2">Shipping to</p>
        <p className="text-sm">
          {order.shippingAddress.fullName}<br />
          {order.shippingAddress.addressLine}<br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
          {order.shippingAddress.country}
        </p>
      </div>

      <Link to="/" className="text-clay-dark font-medium hover:underline text-sm">
        Continue shopping
      </Link>
    </div>
  );
}
