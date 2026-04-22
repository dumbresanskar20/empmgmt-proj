import React, { useState } from 'react';
import axios from 'axios';

const LeaveForm = () => {
    const [formData, setFormData] = useState({
        leaveType: 'casual',
        fromDate: '',
        toDate: '',
        reason: '',
    });
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPrescription(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = new FormData();
        data.append('leaveType', formData.leaveType);
        data.append('fromDate', formData.fromDate);
        data.append('toDate', formData.toDate);
        data.append('reason', formData.reason);
        
        if (formData.leaveType === 'sick' && prescription) {
            data.append('prescription', prescription);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/leaves', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: 'Leave application submitted successfully!' });
            setFormData({ leaveType: 'casual', fromDate: '', toDate: '', reason: '' });
            setPrescription(null);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Error submitting application' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leave-form-container">
            <h2>Apply for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Leave Type</label>
                    <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
                        <option value="casual">Casual Leave</option>
                        <option value="sick">Sick Leave</option>
                        <option value="annual">Annual Leave</option>
                        <option value="maternity">Maternity Leave</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>From Date</label>
                        <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>To Date</label>
                        <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Reason</label>
                    <textarea name="reason" value={formData.reason} onChange={handleChange} required placeholder="State your reason..." />
                </div>

                {formData.leaveType === 'sick' && (
                    <div className="form-group animated-fade-in">
                        <label>Upload Prescription (Required for Sick Leave)</label>
                        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required />
                        <small>Supported: JPG, PNG, PDF (Max 10MB)</small>
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Apply Leave'}
                </button>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>

            <style jsx>{`
                .leave-form-container { max-width: 500px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                label { font-weight: 600; margin-bottom: 0.5rem; color: #333; }
                input, select, textarea { padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
                textarea { height: 100px; resize: vertical; }
                button { background: #6366f1; color: #white; border: none; padding: 1rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
                button:hover { background: #4f46e5; }
                button:disabled { opacity: 0.7; cursor: not-allowed; }
                .message { margin-top: 1rem; padding: 1rem; border-radius: 8px; text-align: center; }
                .success { background: #d1fae5; color: #065f46; }
                .error { background: #fee2e2; color: #991b1b; }
                .animated-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default LeaveForm;
