import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl font-bold mb-6">Your orders</h1>

      {loading && <p className="text-ink-soft text-sm">Loading…</p>}

      {!loading && orders.length === 0 && (
        <div className="border border-dashed border-line rounded-xl py-16 text-center">
          <p className="text-ink-soft mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="text-clay-dark font-medium hover:underline">Start shopping</Link>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block border border-line rounded-xl p-4 hover:border-clay transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="capitalize">{order.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
