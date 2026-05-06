import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profileType: 'NWKR',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(formData.email, formData.password, formData.profileType);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] sm:min-h-[80vh] px-4">
      <div className="w-full max-w-md p-4 sm:p-6 md:p-8 bg-card border border-border rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-foreground">Register</h2>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 sm:mb-2 text-foreground">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Confirm your password"
            />
          </div>

          <div className="!mt-4 sm:!mt-6">
            <label className="block text-sm font-medium mb-2 sm:mb-3 text-foreground">
              Profile Type
            </label>
            <div className="space-y-2">
              <label className="flex items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                <input
                  type="radio"
                  name="profileType"
                  value="NWKR"
                  checked={formData.profileType === 'NWKR'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary mt-0.5 sm:mt-0 flex-shrink-0"
                />
                <div>
                  <div className="font-medium text-foreground text-sm sm:text-base">Nachwuchskraft (NwKR)</div>
                  <div className="text-xs text-muted-foreground">Young professional seeking mentorship</div>
                </div>
              </label>
              <label className="flex items-start sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                <input
                  type="radio"
                  name="profileType"
                  value="BE"
                  checked={formData.profileType === 'BE'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary mt-0.5 sm:mt-0 flex-shrink-0"
                />
                <div>
                  <div className="font-medium text-foreground text-sm sm:text-base">Business Expert (BE)</div>
                  <div className="text-xs text-muted-foreground">Experienced professional offering guidance</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 text-sm sm:text-base"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
