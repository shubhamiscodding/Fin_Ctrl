import React from 'react';

const User = () => {
    const users = [
        { id: 'AXSCW3233124', name: 'Name' },
        { id: 'AXSCW3233124', name: 'Name' },
        { id: 'AXSCW3233124', name: 'Name' },
        { id: 'AXSCW3233124', name: 'Name' },
        { id: 'AXSCW3233124', name: 'Name' },
        { id: 'AXSCW3233124', name: 'Name' }
    ];

    return (
        <div className="min-h-screen bg-white p-8 flex justify-evenly ">
            <div className="grid grid-cols-2 gap-5 mb-5 h-80 min-w-200 ">
                {users.map((user, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg  shadow-gray-700 shadow-sm flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.id}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className=" w-100 min-w-25 box-border shadow-black shadow-sm rounded-sm">
                <div className="flex justify-center items-center mb-4  bg-gray-300 min-h-30">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3 p-4">
                    <div>
                        <span className="text-sm">Name: </span>
                        <span>Angela</span>
                    </div>

                    <div>
                        <span className="text-sm">Email:</span>
                        <div className="border-b border-gray-300 mt-1"></div>
                    </div>

                    <div>
                        <span className="text-sm">Id:</span>
                        <div className="border-b border-gray-300 mt-1"></div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <button className="w-full py-1 px-4 bg-gray-100 text-gray-800 rounded">
                            See More
                        </button>

                        <button className="w-full py-1 px-4 bg-red-500 text-white rounded">
                            Delete user
                        </button>

                        <button className="w-full py-1 px-4 bg-orange-400 text-white rounded">
                            Give Admin Power
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;