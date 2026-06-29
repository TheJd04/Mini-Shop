import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const [searchInput, setSearchInput] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (searchInput) next.search = searchInput;
    if (category) next.category = category;
    setSearchParams(next);
  };

  const handleCategoryClick = (cat) => {
    const next = {};
    if (search) next.search = search;
    if (cat !== category) next.category = cat;
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-clay mb-3">New arrivals</p>
        <h1 className="font-display text-4xl font-bold mb-3 leading-tight">Goods made to last</h1>
        <p className="text-ink-soft text-base">
          Small-batch essentials for the home, table, and wardrobe — chosen for craft, not trend.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-line">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-xs">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="flex-1 border border-line rounded-full px-4 py-2 text-sm focus:border-clay outline-none bg-surface"
          />
          <button
            type="submit"
            className="rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-clay transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`text-xs font-semibold uppercase tracking-wide px-3.5 py-2 rounded-full capitalize transition-colors ${
                category === cat
                  ? 'bg-clay text-white'
                  : 'bg-surface border border-line text-ink-soft hover:border-clay hover:text-clay'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-ink-soft text-sm">Loading products…</p>}

      {!loading && products.length === 0 && (
        <div className="border border-dashed border-line rounded-xl py-16 text-center">
          <p className="text-ink-soft">No products match your filters.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
