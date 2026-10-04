import React, { useState, useEffect } from 'react';
import api from './api';
import {
  UserPlus,
  Users,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Search,
  Sparkles,
  Pencil,
  X
} from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });

  // 1. Track which member ID is currently being edited (null = create mode)
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api');
      setMembers(response.data);
    } catch (err) {
      showNotification('error', 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Name cannot be empty';
    } else if (formData.name.length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 2. Populate form fields and set the editing target ID
  const handleEditClick = (member) => {
    setFormData({ name: member.name, email: member.email });
    setEditingId(member.id);
    setErrors({});
    setApiMessage({ type: '', text: '' });
  };

  // 3. Cancel out of edit mode and reset form
  const handleCancelEdit = () => {
    setFormData({ name: '', email: '' });
    setEditingId(null);
    setErrors({});
  };

  // 4. Unified submit handler branching between POST (Register) and PUT (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiMessage({ type: '', text: '' });

    try {
      if (editingId) {
        // PUT request for updating existing record
        await api.put(`/api/${editingId}`, formData);
        showNotification('success', `Member #${editingId} updated successfully.`);
        setEditingId(null);
      } else {
        // POST request for creating a new member
        const response = await api.post('/api/register', formData);
        showNotification('success', `Registered successfully! ID #${response.data.id}`);
      }

      setFormData({ name: '', email: '' });
      setErrors({});
      fetchMembers();
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Operation failed.';
      showNotification('error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete record for ${name}?`)) return;

    try {
      await api.delete(`/api/${id}`);
      showNotification('success', `${name} has been removed.`);
      setMembers(prev => prev.filter(m => m.id !== id));
      if (editingId === id) handleCancelEdit(); // Clear form if editing deleted item
    } catch (err) {
      showNotification('error', err.response?.data || 'Failed to remove member.');
    }
  };

  const showNotification = (type, text) => {
    setApiMessage({ type, text });
    setTimeout(() => setApiMessage({ type: '', text: '' }), 5000);
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] antialiased selection:bg-indigo-500 selection:text-white font-sans">
      <header className="border-b border-gray-800/80 bg-[#161b22]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-100 tracking-tight text-lg">
              Registration <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ml-1">Portal</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-medium uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{editingId ? `Editing ID #${editingId}` : 'New Record'}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-100">
                  {editingId ? 'Edit Member' : 'Add Member'}
                </h1>
              </div>

              {/* Cancel Button if active editing */}
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1 bg-gray-800/60 px-2.5 py-1.5 rounded-md border border-gray-700/50 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {apiMessage.text && (
              <div className={`mb-5 p-3.5 rounded-lg border text-xs flex items-start space-x-2.5 transition-all ${
                apiMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}>
                {apiMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{apiMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-[#0d1117] border ${
                    errors.name ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } rounded-lg px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all`}
                />
                {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-[#0d1117] border ${
                    errors.email ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-gray-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } rounded-lg px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all`}
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full mt-2 font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  editingId
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : editingId ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    <span>Update Record</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-4">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-semibold text-gray-100">Database Records</h2>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0d1117]/50 border-b border-gray-800 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-xs">
                  {loading ? (
                    <tr><td colSpan="3" className="py-8 text-center text-gray-500">Connecting to Spring Boot...</td></tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr><td colSpan="3" className="py-8 text-center text-gray-500">No records found.</td></tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={`transition-colors group ${editingId === member.id ? 'bg-amber-500/5 border-l-2 border-l-amber-500' : 'hover:bg-gray-800/30'}`}
                      >
                        <td className="py-3.5 px-4 font-mono text-gray-500">{member.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-200">{member.name}</div>
                          <div className="text-[11px] text-gray-400">{member.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditClick(member)}
                            className="text-gray-500 hover:text-amber-400 p-1.5 rounded-md hover:bg-amber-500/10 transition-all"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
                            className="text-gray-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-500/10 transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}