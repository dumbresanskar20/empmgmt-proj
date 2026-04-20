import React, { useEffect, useState } from 'react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import { useAuth } from '../App';

const DOC_TYPES = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Utility Bills'];

export default function Profile() {
  const { user } = useAuth();
  const [documents, setDocuments]     = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [docType, setDocType]         = useState(DOC_TYPES[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [employeeId, setEmployeeId]   = useState('');

  // For demo: allow entering employee ID to look up documents
  const [empIdInput, setEmpIdInput]   = useState('');

  const fetchDocuments = async (id) => {
    if (!id) return;
    setLoadingDocs(true);
    setError('');
    try {
      const { data } = await getDocuments(id);
      setDocuments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile)  { setError('Please select a file'); return; }
    if (!employeeId)    { setError('Please enter an Employee ID'); return; }

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('employeeId', employeeId);
    formData.append('documentType', docType);

    setUploading(true);
    setError('');
    try {
      await uploadDocument(formData);
      setSuccess('Document uploaded successfully!');
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
      fetchDocuments(employeeId);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      setSuccess('Document deleted.');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const fileSizeStr = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const docIcon = (type) => {
    if (!type) return 'description';
    const t = type.toLowerCase();
    if (t.includes('pdf')) return 'picture_as_pdf';
    if (t.includes('png') || t.includes('jpg') || t.includes('jpeg')) return 'image';
    return 'insert_drive_file';
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div>
      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h2>{user?.name || 'User'}</h2>
          <p style={{ marginBottom: 8 }}>{user?.email}</p>
          <span className={`badge badge-${user?.role === 'admin' ? 'purple' : 'info'}`}>
            <span className="material-icons-round" style={{ fontSize: 13 }}>
              {user?.role === 'admin' ? 'admin_panel_settings' : 'person'}
            </span>
            {user?.role || 'employee'}
          </span>
        </div>
      </div>

      {/* Account Details Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">
            <span className="material-icons-round" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>
              account_circle
            </span>
            Account Information
          </span>
        </div>
        <div className="profile-detail-grid">
          {[
            { label: 'Full Name',     value: user?.name,  icon: 'person' },
            { label: 'Email Address', value: user?.email, icon: 'mail' },
            { label: 'Role',          value: user?.role,  icon: 'admin_panel_settings' },
            { label: 'Account ID',    value: user?._id?.slice(-8)?.toUpperCase(), icon: 'fingerprint' },
          ].map(({ label, value, icon }) => (
            <div className="detail-item" key={label}>
              <div className="detail-label">{label}</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--primary-light)' }}>{icon}</span>
                {value || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">
            <span className="material-icons-round" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>
              upload_file
            </span>
            Upload Employee Document
          </span>
        </div>

        {error   && <div className="alert alert-error"><span className="material-icons-round" style={{fontSize:17}}>error_outline</span>{error}</div>}
        {success && <div className="alert alert-success"><span className="material-icons-round" style={{fontSize:17}}>check_circle</span>{success}</div>}

        <form onSubmit={handleUpload} id="upload-form">
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="emp-id-input">Employee ID</label>
              <div className="form-control-icon">
                <span className="material-icons-round input-icon">badge</span>
                <input
                  id="emp-id-input"
                  type="text"
                  className="form-control"
                  placeholder="MongoDB ObjectId of employee"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="doc-type-select">Document Type</label>
              <select
                id="doc-type-select"
                className="form-control"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className="upload-zone"
            onClick={() => document.getElementById('file-input').click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              const file = e.dataTransfer.files[0];
              if (file) setSelectedFile(file);
            }}
          >
            <span className="material-icons-round">cloud_upload</span>
            {selectedFile ? (
              <>
                <p><strong style={{ color: 'var(--primary-light)' }}>{selectedFile.name}</strong></p>
                <p style={{ fontSize: 11, marginTop: 4 }}>{fileSizeStr(selectedFile.size)}</p>
              </>
            ) : (
              <>
                <p><strong>Click to browse</strong> or drag & drop</p>
                <p style={{ marginTop: 4 }}>PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
          <input
            id="file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => setSelectedFile(e.target.files[0] || null)}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              id="upload-btn"
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !selectedFile}
            >
              {uploading ? (
                <><div className="spinner" />Uploading...</>
              ) : (
                <><span className="material-icons-round">upload</span>Upload Document</>
              )}
            </button>
            {employeeId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fetchDocuments(employeeId)}
                disabled={loadingDocs}
                id="load-docs-btn"
              >
                <span className="material-icons-round">refresh</span>
                Load Documents
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Documents List */}
      {(loadingDocs || documents.length > 0) && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="material-icons-round" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>
                folder_open
              </span>
              Uploaded Documents
              <span style={{
                marginLeft: 10, background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)',
                borderRadius: 20, padding: '2px 10px', fontSize: 12,
              }}>
                {documents.length}
              </span>
            </span>
          </div>

          {loadingDocs ? (
            <div className="loading-screen" style={{ minHeight: 120 }}>
              <div className="spinner" /><span>Loading documents…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'var(--bg-card2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    gap: 12, flexWrap: 'wrap',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: 'rgba(99,102,241,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="material-icons-round" style={{ color: 'var(--primary-light)', fontSize: 22 }}>
                        {docIcon(doc.mimeType)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                        {doc.originalName || doc.filePath}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        <span className="badge badge-info" style={{ marginRight: 8 }}>{doc.documentType}</span>
                        {fileSizeStr(doc.fileSize)} · {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${doc.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="View"
                    >
                      <span className="material-icons-round" style={{ fontSize: 15 }}>open_in_new</span>
                    </a>
                    <button
                      id={`del-doc-${doc._id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(doc._id)}
                      title="Delete"
                    >
                      <span className="material-icons-round" style={{ fontSize: 15 }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
