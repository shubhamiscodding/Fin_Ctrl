import React, { useEffect, useState } from 'react';

const User = ({ isSidebarOpen }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://fin-ctrl-1.onrender.com/FinCtrl/admin");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className={`min-h-screen bg-white p-8 flex justify-evenly transition-all duration-300 ${isSidebarOpen ? "ml-64" : "-ml-8"}`}>
            {/* Users Grid */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? "w-1/3" : "w-1/2"}`}>
                <div className="grid grid-cols-2 gap-5">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="p-4 bg-white rounded-lg shadow-lg flex items-center space-x-3 cursor-pointer transition-all duration-300"
                        >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Details Panel */}
            <div
                className={`transition-all duration-300 p-6 bg-white shadow-lg rounded-lg ${isSidebarOpen ? "w-1/2" : "w-1/3"}`}
            >
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
                                <span>{selectedUser.name}</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold">Email: </span>
                                <span>{selectedUser.email || "Loading..."}</span>
                                <div className="border-b border-gray-300 mt-1"></div>
                            </div>
                            <div>
                                <span className="text-sm font-semibold">ID: </span>
                                <span>{selectedUser.id}</span>
                                <div className="border-b border-gray-300 mt-1"></div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <button className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded">See More</button>
                                <button className="w-full py-2 px-4 bg-red-500 text-white rounded">Delete User</button>
                                <button className="w-full py-2 px-4 bg-orange-400 text-white rounded">Give Admin Power</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center">Select a user to view details</p>
                )}
            </div>
        </div>
    );
};

export default User;
