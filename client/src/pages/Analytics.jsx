import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [loanData, setLoanData] = useState([]);
  const [strategyData, setStrategyData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/borrowers/analytics');
        setLoanData(res.data.loanData);
        setStrategyData(res.data.strategyData);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart - Recovery by Risk Level */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recovery by Risk Level</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loanData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recovered" fill="#4ade80" name="Recovered" />
              <Bar dataKey="unrecovered" fill="#f87171" name="Unrecovered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Strategy Usage */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Strategy Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={strategyData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
