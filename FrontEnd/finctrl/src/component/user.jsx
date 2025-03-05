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
                key={user.userId._id}
                onClick={() => setSelectedUser(user)}
                className="p-4 bg-white rounded-lg shadow-lg flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{user.userId.username}</h3>
                  <p className="text-sm text-gray-500">{user.userId.email}</p>
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
            <div className="flex justify-center items-center mb-4 bg-gray-300 h-32">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold">Name: </span>
                <span>{selectedUser.userId.username}</span>
              </div>
              <div>
                <span className="text-sm font-semibold">Email: </span>
                <span>{selectedUser.userId.email}</span>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
              <div>
                <span className="text-sm font-semibold">Joined: </span>
                <span>{new Date(selectedUser.userId.createdAt).toLocaleDateString("en-US")}</span>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>

              <div className="space-y-2 pt-2">
                <button className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                  See More
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.userId._id)}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete User
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