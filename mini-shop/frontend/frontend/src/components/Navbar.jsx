import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import HeirloomMark from './HeirloomMark';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, setDrawerOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-paper border-b border-line sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
        <Link to="/" className="flex items-center gap-2.5">
          <HeirloomMark size={30} />
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Heirloom
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium whitespace-nowrap">
          <Link to="/" className="text-ink hover:text-clay transition-colors">Shop</Link>

          {user ? (
            <>
              <Link to="/orders" className="text-ink hover:text-clay transition-colors">Orders</Link>
              <span className="hidden sm:inline text-ink-soft text-xs">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-ink-soft hover:text-clay transition-colors">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink hover:text-clay transition-colors">Log in</Link>
              <Link
                to="/signup"
                className="rounded-full bg-ink text-paper px-4 py-1.5 hover:bg-clay transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 hover:border-clay transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={15} />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-clay text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
