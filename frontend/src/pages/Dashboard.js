import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getEmployees } from '../services/api';
import { useAuth } from '../App';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isAdmin) {
          const [analyticsRes, empRes] = await Promise.all([
            getAnalytics(),
            getEmployees({ limit: 5, page: 1 }),
          ]);
          setAnalytics(analyticsRes.data);
          setRecentEmployees(empRes.data.employees || []);
        } else {
          const empRes = await getEmployees({ limit: 5, page: 1 });
          setRecentEmployees(empRes.data.employees || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const deptChartData = analytics?.departmentStats?.map((d) => ({
    name: d._id || 'Unknown',
    employees: d.count,
    avgSalary: Math.round(d.avgSalary / 1000),
  })) || [];

  const statusData = analytics
    ? [
        { name: 'Active', value: analytics.active },
        { name: 'Inactive', value: analytics.inactive },
      ]
    : [];

  const greetHour = new Date().getHours();
  const greeting =
    greetHour < 12 ? 'Good morning' : greetHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Greeting Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-card), var(--bg-card2))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
            borderRadius: '50%',
          }}
        />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {isAdmin
              ? 'Here is your company overview for today.'
              : 'Welcome to Employee Manager. View your profile and team below.'}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/employees')}
          id="view-employees-btn"
        >
          <span className="material-icons-round">people</span>
          View Employees
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="material-icons-round" style={{ fontSize: 18 }}>error_outline</span>
          {error}
        </div>
      )}

      {/* Stats - Admin only */}
      {isAdmin && analytics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <span className="material-icons-round">groups</span>
              </div>
              <div className="stat-info">
                <div className="label">Total Employees</div>
                <div className="value">{analytics.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <span className="material-icons-round">check_circle</span>
              </div>
              <div className="stat-info">
                <div className="label">Active</div>
                <div className="value" style={{ color: 'var(--success)' }}>{analytics.active}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <span className="material-icons-round">pause_circle</span>
              </div>
              <div className="stat-info">
                <div className="label">Inactive</div>
                <div className="value" style={{ color: 'var(--warning)' }}>{analytics.inactive}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon cyan">
                <span className="material-icons-round">business</span>
              </div>
              <div className="stat-info">
                <div className="label">Departments</div>
                <div className="value" style={{ color: 'var(--secondary)' }}>
                  {analytics.departmentStats?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {deptChartData.length > 0 && (
            <div className="chart-grid">
              {/* Bar Chart – Employees per Department */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Employees by Department</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={deptChartData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Bar dataKey="employees" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart – Active vs Inactive */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Employee Status</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%" cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* Recent Employees Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <span className="material-icons-round" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>
              schedule
            </span>
            Recently Added Employees
          </span>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/employees')}>
            View All
          </button>
        </div>
        {recentEmployees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <span className="material-icons-round" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>
              people_outline
            </span>
            No employees added yet.{' '}
            {isAdmin && (
              <a href="/employees" style={{ color: 'var(--primary-light)', cursor: 'pointer' }}>
                Add the first one →
              </a>
            )}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${COLORS[emp.name.charCodeAt(0) % COLORS.length]}, #06b6d4)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
                          }}
                        >
                          {emp.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                            {emp.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>
                      <span className={`badge badge-${emp.status === 'active' ? 'success' : 'warning'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
