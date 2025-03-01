import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus, Key, Shield } from "lucide-react";

const registerUser = async (userData, role) => {
  const endpoint =
    role === "admin"
      ? "https://fin-ctrl-1.onrender.com/FinCtrl/admin/register"
      : "https://fin-ctrl-1.onrender.com/FinCtrl/user/register";

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
    adminName: "",
    email: "",
    password: "",
    passForUser: "",
    admin: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassForUser, setShowPassForUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageAnimation, setPageAnimation] = useState("fade-in");
  
  const navigate = useNavigate();

  // Add entrance animation when component mounts
  useEffect(() => {
    setPageAnimation("fade-in");
    
    // Add CSS for animations
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
    
    try {
      const data = await registerUser(formData, formData.role);
      if (data) {
        // Trigger exit animation before navigating
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className={`w-full max-w-md ${pageAnimation}`}>
        {/* Card with subtle shadow and rounded corners */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-indigo-100">Join us and get started today</p>
          </div>
          
          {/* Form Section */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  I want to register as
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "user"})}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 ${
                      formData.role === "user" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <User size={18} className="mr-2" />
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "admin"})}
                    className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 ${
                      formData.role === "admin" 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                        : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Shield size={18} className="mr-2" />
                    Admin
                  </button>
                </div>
              </div>
              
              {/* Dynamic Fields Based on Role */}
              {formData.role === "user" ? (
                <>
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your username"
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Admin ID Field */}
                  <div className="space-y-2">
                    <label htmlFor="admin" className="block text-sm font-medium text-gray-700">
                      Admin ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="admin"
                        type="text"
                        name="admin"
                        placeholder="Admin ID provided to you"
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Admin Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                      Admin Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserPlus size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="adminName"
                        type="text"
                        name="adminName"
                        placeholder="Your admin name"
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Pass for Users Field */}
                  <div className="space-y-2">
                    <label htmlFor="passForUser" className="block text-sm font-medium text-gray-700">
                      Pass for Users
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="passForUser"
                        type={showPassForUser ? "text" : "password"}
                        name="passForUser"
                        placeholder="Create a pass for your users"
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassForUser(!showPassForUser)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassForUser ? (
                          <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {/* Email Field - Common for both roles */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Password Field - Common for both roles */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
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
                    Create Account <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
              Already have an account?
            </p>
            <button
              onClick={navigateToLogin}
              className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
