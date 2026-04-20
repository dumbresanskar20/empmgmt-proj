import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../App';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              person_add
            </span>
          </div>
          <h1>Create Account</h1>
          <p>Join EmpManager to get started</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="material-icons-round" style={{ fontSize: 18 }}>error_outline</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">person</span>
              <input
                id="reg-name"
                type="text"
                name="name"
                className="form-control"
                placeholder="John Smith"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">mail</span>
              <input
                id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">lock</span>
              <input
                id="reg-password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">Account Role</label>
            <div className="form-control-icon">
              <span className="material-icons-round input-icon">admin_panel_settings</span>
              <select
                id="reg-role"
                name="role"
                className="form-control"
                value={form.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Creating Account...
              </>
            ) : (
              <>
                <span className="material-icons-round">how_to_reg</span>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
