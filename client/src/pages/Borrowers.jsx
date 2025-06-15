import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Search, Filter, Plus, Eye, Trash2, User, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

const riskColor = {
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Low: 'text-green-600 bg-green-50 border-green-200',
};

const statusColor = {
  Pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Paid: 'text-green-600 bg-green-50 border-green-200',
  Overdue: 'text-red-600 bg-red-50 border-red-200',
  Current: 'text-blue-600 bg-blue-50 border-blue-200',
};

const Borrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [newBorrower, setNewBorrower] = useState({
    name: '',
    email: '',
    phone: '',
    loanAmount: '',
    dueDate: '',
    risk: 'Low',
    status: 'Pending',
  });
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this borrower?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/borrowers/${id}`);
      setBorrowers(borrowers.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete borrower');
    }
  };

  const handleCreateBorrower = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/borrowers', newBorrower);
      alert('Borrower added successfully');
      setShowForm(false);
      setNewBorrower({
        name: '',
        email: '',
        phone: '',
        loanAmount: '',
        dueDate: '',
        risk: 'Low',
        status: 'Pending',
      });

      const res = await axios.get('http://localhost:5000/api/borrowers');
      setBorrowers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add borrower');
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/borrowers')
      .then((res) => {
        setBorrowers(res.data)
      })
      .catch((err) => console.error('Error fetching borrowers:', err));
  }, []);

  const filteredBorrowers = borrowers.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'All' || b.risk === riskFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Borrowers</h1>
              <p className="text-slate-600">Manage and track your loan borrowers</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600 bg-white px-3 py-2 rounded-lg border">
                Total: {filteredBorrowers.length}
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Borrower</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Borrower Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800">Add New Borrower</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateBorrower} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={newBorrower.name}
                        onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                        placeholder="Enter full name"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={newBorrower.email}
                      onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newBorrower.phone}
                      onChange={(e) => setNewBorrower({ ...newBorrower, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Loan Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        name="loanAmount"
                        value={newBorrower.loanAmount}
                        onChange={(e) => setNewBorrower({ ...newBorrower, loanAmount: e.target.value })}
                        placeholder="Enter loan amount"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Due Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="date"
                        name="dueDate"
                        value={newBorrower.dueDate}
                        onChange={(e) => setNewBorrower({ ...newBorrower, dueDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Risk Level</label>
                    <select
                      value={newBorrower.risk}
                      onChange={(e) => setNewBorrower({ ...newBorrower, risk: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={newBorrower.status}
                    onChange={(e) => setNewBorrower({ ...newBorrower, status: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Current">Current</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                  >
                    Add Borrower
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search borrowers by name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Filter by:</span>
              </div>
              
              <select
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="All">All Risks</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
              
              <select
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Borrower</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Loan Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBorrowers.length > 0 ? (
                  filteredBorrowers.map((b, index) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{b.name}</div>
                            <div className="text-sm text-slate-500">{b.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">₹{b.loanAmount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-700">{new Date(b.dueDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${riskColor[b.risk]}`}>
                          {b.risk === 'High' && <AlertTriangle size={12} className="mr-1" />}
                          {b.risk === 'Medium' && <Clock size={12} className="mr-1" />}
                          {b.risk === 'Low' && <CheckCircle size={12} className="mr-1" />}
                          {b.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/borrower/${b._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Borrower"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <User size={24} className="text-slate-400" />
                        </div>
                        <div className="text-slate-500 font-medium">No borrowers found</div>
                        <div className="text-sm text-slate-400">Try adjusting your search or filters</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredBorrowers.length > 0 ? (
            filteredBorrowers.map((b) => (
              <div key={b._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{b.name}</div>
                      <div className="text-sm text-slate-500">{b.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/borrower/${b._id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Loan Amount</div>
                    <div className="font-semibold text-slate-900">₹{b.loanAmount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Due Date</div>
                    <div className="text-slate-700">{new Date(b.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${riskColor[b.risk]}`}>
                    {b.risk === 'High' && <AlertTriangle size={12} className="mr-1" />}
                    {b.risk === 'Medium' && <Clock size={12} className="mr-1" />}
                    {b.risk === 'Low' && <CheckCircle size={12} className="mr-1" />}
                    {b.risk}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-slate-400" />
                </div>
                <div className="text-slate-500 font-medium">No borrowers found</div>
                <div className="text-sm text-slate-400">Try adjusting your search or filters</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Borrowers;