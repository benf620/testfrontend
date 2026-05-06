import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, formData.rememberMe);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] sm:min-h-[80vh] px-4">
      <div className="w-full max-w-md p-4 sm:p-6 md:p-8 bg-card border border-border rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-foreground">Login</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 sm:mb-2 text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 sm:mb-2 text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="rememberMe" className="text-sm text-foreground">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 text-sm sm:text-base"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
