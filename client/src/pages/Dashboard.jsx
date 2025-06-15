import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, highRisk: 0, recoveryRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/borrowers/dash');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Borrowers</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">High Risk Accounts</h2>
          <p className="text-2xl font-bold text-red-500">{stats.highRisk}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Recovery Rate</h2>
          <p className="text-2xl font-bold text-green-500">{stats.recoveryRate}%</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
