import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="group bg-surface border border-line rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-square overflow-hidden bg-sand relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {outOfStock && (
            <span className="absolute top-3 left-3 bg-ink text-paper text-xs font-medium px-2.5 py-1 rounded-full">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`} className="block">
          <p className="text-[11px] text-ink-soft uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-display font-semibold text-base leading-snug mb-2 group-hover:text-clay transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between pt-1">
          <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-2 bg-ink text-paper hover:bg-clay transition-colors disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed"
          >
            <Plus size={13} strokeWidth={2.5} />
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
