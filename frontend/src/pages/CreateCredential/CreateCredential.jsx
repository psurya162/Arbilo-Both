import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import config from '@/config.js/config';

const CreateCredential = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_URL}/api/auth/create-user`, { email, name });
      // Show the backend message on success
      toast.success(response.data.message || 'User created and credentials sent successfully');
      // Clear the form fields
        setEmail('');
        setName('');
    } catch (error) {
      // Show the error message from backend, fallback to default if unavailable
      toast.error(error.response?.data?.message || 'Failed to send credentials');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 mx-auto space-y-6">
        <Toaster/>
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Credential</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleCreateUser}
        className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Credentials'}
      </button>
    </div>
  );
};

export default CreateCredential;
