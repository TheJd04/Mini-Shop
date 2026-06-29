import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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

  const outOfStock = product.stock === 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded-2xl overflow-hidden bg-sand">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <p className="text-xs text-ink-soft uppercase tracking-wide mb-2">{product.category}</p>
        <h1 className="font-display text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-2xl font-semibold mb-5">${product.price.toFixed(2)}</p>
        <p className="text-ink-soft leading-relaxed mb-6">{product.description}</p>

        {outOfStock ? (
          <p className="text-clay font-medium mb-6">Currently sold out</p>
        ) : (
          <p className="text-sm text-ink-soft mb-6">{product.stock} in stock</p>
        )}

        <div className="flex items-center gap-4">
          {!outOfStock && (
            <div className="flex items-center gap-2 border border-line rounded-full px-3 py-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          )}

          <button
            onClick={() => addToCart(product._id, quantity)}
            disabled={outOfStock}
            className="rounded-full bg-ink text-paper px-6 py-2.5 font-medium hover:bg-clay transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
