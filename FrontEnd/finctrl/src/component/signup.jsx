import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus, Key, Shield } from "lucide-react";

const registerUser = async (userData, role) => {
  const endpoint =
    role === "admin"
      ? "https://fin-ctrl-1.onrender.com/admin/register"
      : "https://fin-ctrl-1.onrender.com/users/registration";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Signup failed");

    console.log("Signup successful:", data);
    return data;
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error;
  }
};

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminName: "",
    passForUser: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassForUser, setShowPassForUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageAnimation, setPageAnimation] = useState("fade-in");
  
  const navigate = useNavigate();

  useEffect(() => {
    setPageAnimation("fade-in");
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
      
      .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .fade-out {
        animation: fadeOut 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const payload = formData.role === "admin"
      ? {
          adminName: formData.adminName,
          email: formData.email,
          password: formData.password,
          passForUser: formData.passForUser,
        }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          adminName: formData.adminName,
          passForUser: formData.passForUser,
        };

    try {
      const data = await registerUser(payload, formData.role);
      if (data) {
        setPageAnimation("fade-out");
        setTimeout(() => navigate("/login"), 400);
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    setPageAnimation("fade-out");
    setTimeout(() => navigate("/login"), 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-8 sm:py-12">
      <div className={`w-full max-w-md sm:max-w-lg md:max-w-xl ${pageAnimation}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-indigo-100 text-sm sm:text-base">Join us and get started today</p>
          </div>
          
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 sm:mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-xs sm:text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-gray-700">
                  I want to register as
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`flex items-center justify-center p-2 sm:p-3 border rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                      formData.role === "user" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <User size={16} className="mr-1 sm:mr-2" />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`flex items-center justify-center p-2 sm:p-3 border rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                      formData.role === "admin" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Shield size={16} className="mr-1 sm:mr-2" />
                    Admin
                  </button>
                </div>
              </div>
              
              {formData.role === "user" ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="adminName" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Admin Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserPlus size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="adminName"
                        type="text"
                        name="adminName"
                        placeholder="Enter admin name"
                        value={formData.adminName}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="passForUser" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Pass for Users
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="passForUser"
                        type={showPassForUser ? "text" : "password"}
                        name="passForUser"
                        placeholder="Create a pass for users"
                        value={formData.passForUser}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassForUser(!showPassForUser)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassForUser ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="adminName" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Admin Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserPlus size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="adminName"
                        type="text"
                        name="adminName"
                        placeholder="Your admin name"
                        value={formData.adminName}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="passForUser" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Pass for Users
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="passForUser"
                        type={showPassForUser ? "text" : "password"}
                        name="passForUser"
                        placeholder="Create a pass for your users"
                        value={formData.passForUser}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassForUser(!showPassForUser)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassForUser ? (
                          <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Create Account <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="px-6 py-4 sm:px-8 sm:py-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center sm:flex-row sm:justify-between">
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0 text-center">
              Already have an account?
            </p>
            <button
              onClick={navigateToLogin}
              className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-indigo-600 text-xs sm:text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;