import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-sm mx-auto px-6 py-24 text-center">
      <p className="font-display text-5xl font-bold text-clay mb-4">404</p>
      <h1 className="font-display text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-ink-soft mb-6 text-sm">This page doesn't exist.</p>
      <Link to="/" className="text-clay-dark font-medium hover:underline text-sm">
        Back to shop
      </Link>
    </div>
  );
}
