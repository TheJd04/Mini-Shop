import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeirloomMark from '../components/HeirloomMark';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account');
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
        <h1 className="font-display text-2xl font-bold mb-2 text-center">Create an account</h1>
        <p className="text-ink-soft text-sm text-center mb-8">Join Heirloom in under a minute</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="name">Name</label>
            <input
              id="name" name="name" type="text" required
              value={form.name} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
          </div>
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
              id="password" name="password" type="password" required minLength={6}
              value={form.password} onChange={handleChange}
              className="w-full border border-line rounded-xl px-4 py-2.5 outline-none focus:border-clay"
            />
            <p className="text-xs text-ink-soft mt-1">At least 6 characters.</p>
          </div>

          {error && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-full bg-ink text-paper py-2.5 font-medium hover:bg-clay transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
      </div>

      <p className="text-sm text-ink-soft text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-clay-dark font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
}
