import React, { useEffect, useState } from "react";
import { LoadingIcon } from "../components/ui/loading-icon";

const User = ({ isSidebarOpen }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please log in.");
      }

      const response = await fetch("https://fin-ctrl-1.onrender.com/admin/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        if (response.status === 403) throw new Error("Access denied: Admins only.");
        if (response.status === 404) throw new Error("No users found for this admin.");
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      console.log("Users fetched:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please log in.");

      const response = await fetch(`https://fin-ctrl-1.onrender.com/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        if (response.status === 403) throw new Error("Access denied: Only admins can delete users.");
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      setUsers((prev) => prev.filter((user) => user.userId._id !== userId));
      setSelectedUser(null); // Clear selection if deleted user was selected
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">😕</p>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white p-8 flex justify-evenly transition-all duration-300 ${isSidebarOpen ? "ml-64" : "-ml-8"}`}>
      {/* Users Grid */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-1/3" : "w-1/2"}`}>
        <h2 className="text-2xl font-bold mb-4">Managed Users</h2>
        <div className="grid grid-cols-2 gap-5">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <LoadingIcon size={58} color="border-l-indigo-500" />
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="p-4 bg-white rounded-lg shadow-lg flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-lg">
                    {user.userId?.username ? user.userId.username.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{user.userId?.username || 'No Username'}</h3>
                  <p className="text-sm text-gray-500">{user.userId?.email || 'No Email'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>
      </div>

      {/* User Details Panel */}
      <div className={`transition-all duration-300 p-6 bg-white shadow-lg rounded-lg ${isSidebarOpen ? "w-1/2" : "w-1/3"}`}>
        {selectedUser ? (
          <>
            <div className="flex justify-center items-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 h-40 rounded-t-lg">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg transform -translate-y-12">
                <span className="text-4xl font-bold text-indigo-600">
                  {selectedUser.userId?.username ? selectedUser.userId.username.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
            </div>

            <div className="space-y-4 px-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Name</span>
                    <p className="text-lg">{selectedUser.userId?.username || 'No Username'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Email</span>
                    <p className="text-lg">{selectedUser.userId?.email || 'No Email'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Joined</span>
                    <p className="text-lg">
                      {selectedUser.userId?.createdAt 
                        ? new Date(selectedUser.userId.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.userId._id)}
                  className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Select a user to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;