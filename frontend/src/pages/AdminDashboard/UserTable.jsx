import { useState, useEffect } from 'react';
import config from '@/config.js/config';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('Admin not authenticated!');
          return;
        }

        const response = await axios.get(`${config.API_URL}/api/admin/users`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users); // Correctly set users
        } else {
          console.error('Invalid users data received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error.response?.data?.message || error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActiveStatus = async (user) => {
    // Open confirmation modal before updating
    setSelectedUser(user);
    setConfirmationVisible(true);
  };

  const confirmToggle = async () => {
    if (!selectedUser) return;
  
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('Admin not authenticated!');
        return;
      }
  
      setLoading(true);
  
      const newStatus = selectedUser.is_active === 1 ? 0 : 1; // Toggle between active and inactive
  
      const response = await fetch(`http://localhost:5000/api/admin/users/${selectedUser.id}/toggle-active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: newStatus }), // Send the new status here
      });
  
      if (response.ok) {
        // Update the user status in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, is_active: newStatus } : user
          )
        );
        toast.success('User status updated successfully');
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Error toggling user status');
    } finally {
      setLoading(false);
      setConfirmationVisible(false);
      setSelectedUser(null);
    }
  };
  

  const cancelToggle = () => {
    setConfirmationVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-gray-700">Email</th>
            <th className="px-4 py-2 text-left text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No users found</td>
            </tr>
          ) : (
            Array.isArray(users) && users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleToggleActiveStatus(user)}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {confirmationVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p>Do you want to {selectedUser?.is_active ? 'deactivate' : 'activate'} this user?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={cancelToggle}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
