import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../App';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb1" />
      <div className="auth-bg-orb orb2" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-round" style={{ color: 'white', fontSize: 28 }}>
              corporate_fare
            </span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your EmpManager account</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="material-icons-round" style={{ fontSize: 18 }}>error_outline</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">mail</span>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">lock</span>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Signing in...
              </>
            ) : (
              <>
                <span className="material-icons-round">login</span>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          💡 Register first with role <strong style={{ color: 'var(--primary-light)' }}>admin</strong> to unlock full access
        </div>
      </div>
    </div>
  );
}
