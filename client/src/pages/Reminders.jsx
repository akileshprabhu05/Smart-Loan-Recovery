import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Reminders = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/borrowers')
      .then((res) => {
        setBorrowers(res.data);

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const dueSoon = res.data.filter(borrower => {
          const due = new Date(borrower.dueDate);
          return due >= today && due <= nextWeek && borrower.status === 'Pending';
        });

        setUpcoming(dueSoon);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to fetch borrowers');
      });
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Upcoming Loan Reminders</h1>
      {upcoming.length === 0 ? (
        <p className="text-gray-500">No upcoming dues in the next 7 days.</p>
      ) : (
        <div className="bg-white p-4 rounded shadow space-y-3">
          {upcoming.map((b) => (
            <div key={b._id} className="border-b pb-2">
              <p><strong>{b.name}</strong> - ₹{b.loanAmount}</p>
              <p>Due Date: {new Date(b.dueDate).toLocaleDateString()}</p>
              <p>Status: {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Reminders;
