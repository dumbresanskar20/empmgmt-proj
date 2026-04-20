import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const pageTitles = {
  '/dashboard': { title: 'Dashboard',  subtitle: 'Overview & Analytics' },
  '/employees': { title: 'Employees',  subtitle: 'Manage your workforce' },
  '/profile':   { title: 'My Profile', subtitle: 'Personal details & documents' },
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageTitles[location.pathname] || { title: 'EmpManager', subtitle: '' };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Mobile hamburger */}
        <button
          className="icon-btn"
          onClick={onMenuClick}
          style={{ display: 'none' }}
          id="menu-toggle"
          aria-label="Open menu"
        >
          <span className="material-icons-round">menu</span>
        </button>
        <div>
          <h1>{page.title}</h1>
          {page.subtitle && <p>{page.subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div
          className="user-avatar"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
          title={user?.name}
        >
          {initials}
        </div>
        <button
          className="logout-btn"
          onClick={() => { logout(); navigate('/login'); }}
          aria-label="Logout"
        >
          <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
          <span style={{ display: 'none' }}>Logout</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
