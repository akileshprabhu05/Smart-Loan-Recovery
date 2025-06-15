import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, Loader, Sparkles, Shield, FileText, Eye, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Mock data for demonstration
const mockBorrower = {
  _id: '1',
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  loanAmount: '75000',
  dueDate: '2025-07-15',
  risk: 'Medium',
  status: 'Pending'
};

const strategyDetailsMap = {
  "Follow-up Calls": "It is recommended to initiate follow-up phone calls with the borrower. This personalized communication often prompts quick action and helps in understanding any repayment challenges they might be facing.",
  "Thank You Mail": "Sending a thank you mail as a soft reminder can help maintain a positive relationship while gently nudging the borrower towards timely repayment.",
  "Final Warning": "Issuing a final warning in a professional tone alerts the borrower of potential consequences, encouraging them to take the repayment seriously.",
  "Legal Notice": "If prior recovery strategies have failed, sending a legal notice is a formal step that indicates the seriousness of the situation, possibly involving legal action.",
  "Field Visit": "A field visit by the recovery team can have a strong impact. It shows the organization's commitment and may help resolve the issue directly with the borrower."
};

const riskConfig = {
  High: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle, bgGradient: 'from-red-500 to-red-600' },
  Medium: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock, bgGradient: 'from-yellow-500 to-yellow-600' },
  Low: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, bgGradient: 'from-green-500 to-green-600' },
};

const statusConfig = {
  Pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  Paid: { color: 'text-green-600 bg-green-50 border-green-200' },
  Overdue: { color: 'text-red-600 bg-red-50 border-red-200' },
  Current: { color: 'text-blue-600 bg-blue-50 border-blue-200' },
};

const strategyIcons = {
  "Follow-up Calls": Phone,
  "Thank You Mail": Mail,
  "Final Warning": AlertTriangle,
  "Legal Notice": FileText,
  "Field Visit": MapPin
};

const AIStrategyCard = ({ recommendation, details }) => {
  const StrategyIcon = strategyIcons[recommendation] || Sparkles;
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
          <StrategyIcon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            AI-Recommended Strategy
          </h3>
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
            {recommendation}
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-blue-100">
        <h4 className="font-semibold text-slate-800 mb-2">Strategy Details</h4>
        <p className="text-slate-600 leading-relaxed">{details}</p>
      </div>
    </div>
  );
};

const BorrowerDetails = () => {
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState(null);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/borrowers/${id}`)
      .then((res) => {
        setBorrower(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading borrower:', err);
        setLoading(false);
      });
  }, [id]);

  const calculateDueInDays = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const generateStrategy = () => {
    if (!borrower) return;

    setGenerating(true);
    
    const dueInDays = calculateDueInDays(borrower.dueDate);

    axios.post('http://127.0.0.1:5000/predict', {
      loan_amount: borrower.loanAmount,
      due_in_days: dueInDays,
      risk: borrower.risk,
      status: borrower.status
    })
    .then(res => {
      setStrategy({ recommendation: res.data.strategy });
      setGenerating(false);
    })
    .catch(err => {
      console.error("Prediction error:", err);
      setGenerating(false);
    });
  };

  const handleApprove = () => {
    alert(`Recovery strategy approved for ${borrower.name}`);
  };

  const handleBack = () => {
    navigate('/borrowers')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading borrower details...</p>
        </div>
      </div>
    );
  }

  if (!borrower) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <User size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">Borrower not found</p>
        </div>
      </div>
    );
  }

  const dueInDays = calculateDueInDays(borrower.dueDate);
  const RiskIcon = riskConfig[borrower.risk]?.icon || AlertTriangle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Borrowers</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${riskConfig[borrower.risk]?.bgGradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {borrower.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{borrower.name}</h1>
                <p className="text-slate-600">Borrower Details & Recovery Strategy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${riskConfig[borrower.risk]?.color}`}>
                <RiskIcon size={14} className="mr-1.5" />
                {borrower.risk} Risk
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig[borrower.status]?.color}`}>
                {borrower.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Borrower Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Borrower Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Email Address</div>
                    <div className="text-slate-800 font-semibold">{borrower.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Phone Number</div>
                    <div className="text-slate-800 font-semibold">{borrower.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Loan Amount</div>
                    <div className="text-slate-800 font-semibold text-lg">₹{borrower.loanAmount}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Due Date</div>
                    <div className="text-slate-800 font-semibold">{new Date(borrower.dueDate).toLocaleDateString()}</div>
                    <div className="text-sm text-slate-500">{dueInDays} days remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Strategy Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-600" />
                AI Recovery Strategy
              </h2>

              {strategy ? (
                <div>
                  <AIStrategyCard
                    recommendation={strategy.recommendation}
                    details={strategyDetailsMap[strategy.recommendation]}
                  />
                  <button
                    onClick={handleApprove}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Approve & Execute Strategy
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Generate Recovery Strategy</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Our AI will analyze the borrower's profile and recommend the most effective recovery approach.
                  </p>
                  <button
                    onClick={generateStrategy}
                    disabled={generating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 mx-auto"
                  >
                    {generating ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Generating Strategy...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate Recovery Strategy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                Risk Assessment
              </h3>
              
              <div className={`p-4 rounded-xl border-2 ${riskConfig[borrower.risk]?.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <RiskIcon size={24} />
                  <div>
                    <div className="font-semibold">{borrower.risk} Risk Level</div>
                    <div className="text-sm opacity-75">Current Assessment</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span className="font-semibold">
                      {borrower.risk === 'High' ? '85/100' : borrower.risk === 'Medium' ? '55/100' : '25/100'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        borrower.risk === 'High' ? 'bg-red-500' : 
                        borrower.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: borrower.risk === 'High' ? '85%' : borrower.risk === 'Medium' ? '55%' : '25%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                  <Phone size={18} className="text-blue-600" />
                  <span className="font-medium">Call Borrower</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                  <Mail size={18} className="text-green-600" />
                  <span className="font-medium">Send Email</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                  <FileText size={18} className="text-purple-600" />
                  <span className="font-medium">View Documents</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors">
                  <Eye size={18} className="text-orange-600" />
                  <span className="font-medium">Payment History</span>
                </button>
              </div>
            </div>

            {/* Due Date Alert */}
            <div className={`rounded-2xl p-6 border-2 ${
              dueInDays <= 7 ? 'bg-red-50 border-red-200' : 
              dueInDays <= 30 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={20} className={
                  dueInDays <= 7 ? 'text-red-600' : 
                  dueInDays <= 30 ? 'text-yellow-600' : 
                  'text-green-600'
                } />
                <h3 className="font-semibold text-slate-800">Payment Due</h3>
              </div>
              <p className={`text-2xl font-bold mb-1 ${
                dueInDays <= 7 ? 'text-red-600' : 
                dueInDays <= 30 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {dueInDays} days
              </p>
              <p className="text-sm text-slate-600">
                {dueInDays <= 7 ? 'Urgent attention required' : 
                 dueInDays <= 30 ? 'Follow-up recommended' : 
                 'Payment on track'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDetails;