import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import HeirloomMark from '../components/HeirloomMark';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      await refreshCart();
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log you in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <div className="flex justify-center mb-6">
        <HeirloomMark size={44} />
      </div>

      <div className="bg-surface border border-line rounded-2xl shadow-sm p-8">
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-ink-soft text-sm text-center mb-8">Log in to shop and track orders</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" required
              value={form.password} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-full bg-ink text-paper py-2.5 font-medium hover:bg-clay transition-colors disabled:opacity-50"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>

      <p className="text-sm text-ink-soft text-center mt-6">
        New here?{' '}
        <Link to="/signup" className="text-clay-dark font-medium hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
