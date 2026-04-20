import React, { useEffect, useState, useCallback } from 'react';
import {
  getEmployees, createEmployee, updateEmployee, deleteEmployee,
} from '../services/api';
import { useAuth } from '../App';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
const POSITIONS   = ['Engineer', 'Manager', 'Analyst', 'Designer', 'Director', 'Intern', 'Developer', 'Executive'];
const EMPTY_FORM  = { name: '', email: '', phone: '', department: '', position: '', salary: '', joiningDate: '', status: 'active' };

export default function EmployeeList() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [search, setSearch]         = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 8 };
      if (search)     params.search     = search;
      if (deptFilter) params.department = deptFilter;
      const { data } = await getEmployees(params);
      setEmployees(data.employees || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [page, search, deptFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // debounce search
  useEffect(() => {
    setPage(1);
  }, [search, deptFilter]);

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (emp) => {
    setEditItem(emp);
    setForm({
      name: emp.name, email: emp.email, phone: emp.phone || '',
      department: emp.department, position: emp.position,
      salary: emp.salary, status: emp.status,
      joiningDate: emp.joiningDate ? emp.joiningDate.slice(0, 10) : '',
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); setForm(EMPTY_FORM); };

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await updateEmployee(editItem._id, form);
        showSuccess('Employee updated successfully!');
      } else {
        await createEmployee(form);
        showSuccess('Employee added successfully!');
      }
      closeModal();
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setDeleteId(null);
      showSuccess('Employee deleted.');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setDeleteId(null);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const salaryFmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-round">search</span>
          <input
            id="employee-search"
            type="text"
            placeholder="Search by name, email, position…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            id="dept-filter"
            className="form-control"
            style={{ width: 180, padding: '10px 14px' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          {isAdmin && (
            <button id="add-employee-btn" className="btn btn-primary" onClick={openAdd}>
              <span className="material-icons-round">person_add</span>
              Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error   && <div className="alert alert-error"><span className="material-icons-round" style={{fontSize:18}}>error_outline</span>{error}</div>}
      {success && <div className="alert alert-success"><span className="material-icons-round" style={{fontSize:18}}>check_circle</span>{success}</div>}

      {/* Summary */}
      <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
        {loading ? 'Loading…' : `Showing ${employees.length} of ${total} employees`}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-screen"><div className="spinner" /><span>Loading employees…</span></div>
      ) : employees.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <span className="material-icons-round" style={{ fontSize: 64, color: 'var(--text-muted)', display: 'block', marginBottom: 16 }}>people_outline</span>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No employees found.</p>
          {isAdmin && <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>Add First Employee</button>}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Joined</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: `hsl(${emp.name.charCodeAt(0) * 13 % 360}, 60%, 45%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: 'white',
                      }}>
                        {emp.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{emp.department}</span>
                  </td>
                  <td>{emp.position}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>{salaryFmt(emp.salary)}</td>
                  <td>
                    <span className={`badge badge-${emp.status === 'active' ? 'success' : 'warning'}`}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(emp.joiningDate).toLocaleDateString('en-IN')}</td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          id={`edit-emp-${emp._id}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(emp)}
                          title="Edit"
                        >
                          <span className="material-icons-round" style={{ fontSize: 15 }}>edit</span>
                        </button>
                        <button
                          id={`delete-emp-${emp._id}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteId(emp._id)}
                          title="Delete"
                        >
                          <span className="material-icons-round" style={{ fontSize: 15 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>chevron_left</span>
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <span className="material-icons-round" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            {error && <div className="alert alert-error"><span className="material-icons-round" style={{fontSize:16}}>error_outline</span>{error}</div>}

            <form id="employee-form" onSubmit={handleSave}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-name">Full Name *</label>
                  <input id="emp-name" name="name" className="form-control" value={form.name} onChange={handleFormChange} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-email">Email *</label>
                  <input id="emp-email" name="email" type="email" className="form-control" value={form.email} onChange={handleFormChange} required placeholder="john@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-phone">Phone</label>
                  <input id="emp-phone" name="phone" className="form-control" value={form.phone} onChange={handleFormChange} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-dept">Department *</label>
                  <select id="emp-dept" name="department" className="form-control" value={form.department} onChange={handleFormChange} required>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-pos">Position *</label>
                  <select id="emp-pos" name="position" className="form-control" value={form.position} onChange={handleFormChange} required>
                    <option value="">Select Position</option>
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-salary">Salary (₹) *</label>
                  <input id="emp-salary" name="salary" type="number" min="0" className="form-control" value={form.salary} onChange={handleFormChange} required placeholder="500000" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-joining">Joining Date</label>
                  <input id="emp-joining" name="joiningDate" type="date" className="form-control" value={form.joiningDate} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="emp-status">Status</label>
                  <select id="emp-status" name="status" className="form-control" value={form.status} onChange={handleFormChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button id="save-employee-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" />Saving…</> : <><span className="material-icons-round">save</span>{editItem ? 'Update' : 'Add Employee'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Employee?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
              This action cannot be undone. All data associated with this employee will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button id="confirm-delete-btn" className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                <span className="material-icons-round">delete_forever</span>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
