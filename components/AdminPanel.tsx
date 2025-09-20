import React, { useState } from 'react';
import type { Attendee } from '../types';

interface AdminPanelProps {
  attendees: Attendee[];
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ attendees, onBack }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure authentication process.
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto border border-white/30">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Access</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password-admin" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password-admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-100/70 border-2 border-transparent rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 ease-in-out"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              &larr; Back to Form
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-7xl mx-auto border border-white/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">DS Digital Solutions Connect Attendees ({attendees.length})</h2>
        <button onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Back to Form
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100/70">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profession</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Support Needed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendees.length > 0 ? attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.profession}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{attendee.email}</div>
                    <div>{attendee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{attendee.address}</div>
                    <div>{attendee.city}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{attendee.supportRequired}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(attendee.submittedAt).toLocaleString()}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">No attendees have registered yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;