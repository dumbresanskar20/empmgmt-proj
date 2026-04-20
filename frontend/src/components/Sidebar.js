import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const navItems = [
  { to: '/dashboard', icon: 'dashboard',   label: 'Dashboard' },
  { to: '/employees', icon: 'people',       label: 'Employees' },
  { to: '/profile',   icon: 'person',       label: 'My Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span className="material-icons-round" style={{ color: 'white', fontSize: 22 }}>
            corporate_fare
          </span>
        </div>
        <h2>EmpManager</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="material-icons-round">{icon}</span>
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <span className="nav-section-label">Admin</span>
            <NavLink
              to="/employees"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={onClose}
              style={{ opacity: 0.7 }}
            >
              <span className="material-icons-round">admin_panel_settings</span>
              Manage Employees
            </NavLink>
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div className="role">{user?.role || 'employee'}</div>
          </div>
        </div>
        <button
          className="logout-btn btn-full"
          style={{ marginTop: 12, justifyContent: 'center' }}
          onClick={handleLogout}
        >
          <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
