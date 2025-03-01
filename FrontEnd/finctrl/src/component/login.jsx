// import { useEffect, useRef } from "react";
// import "./login.css";
// import { Link } from "react-router-dom";

// export default function Login() {
//     const containerRef = useRef(null);
//     const overlayBtnRef = useRef(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         const overlayBtn = overlayBtnRef.current;

//         const togglePanel = () => {
//             container.classList.toggle("right-panel-active");

//             // Remove the scaling effect and re-trigger the animation
//             overlayBtn.classList.remove("btnScaled");
//             window.requestAnimationFrame(() => {
//                 overlayBtn.classList.add("btnScaled");
//             });
//         };

//         overlayBtn.addEventListener("click", togglePanel);

//         return () => {
//             overlayBtn.removeEventListener("click", togglePanel);
//         };
//     }, []);

//     return (
//         <>
//             <div className="container" id="container" ref={containerRef}>
//                 <div className="form-container sign-up-container">
//                     <form onSubmit={(e) => e.preventDefault()}>
//                         <h1>Create Account</h1>
//                         <div className="social-container">
//                             <button className="social" onClick={() => console.log("Facebook icon clicked!")}>
//                                 <i className="fab fa-facebook-f"></i>
//                             </button>
//                             <button className="social" onClick={() => console.log("Google icon clicked!")}>
//                                 <i className="fab fa-google"></i>
//                             </button>
//                             <button className="social" onClick={() => console.log("LinkedIn icon clicked!")}>
//                                 <i className="fab fa-linkedin-in"></i>
//                             </button>
//                         </div>
//                         <span>or use your email for registration</span>
//                         <div className="infield">
//                             <input type="text" placeholder="Name" />
//                             <label></label>
//                         </div>
//                         <div className="infield">
//                             <input type="email" placeholder="Email" name="email" />
//                             <label></label>
//                         </div>
//                         <div className="infield">
//                             <input type="password" placeholder="Password" />
//                             <label></label>
//                         </div>
//                         <button type="submit">Sign Up</button>
//                     </form>
//                 </div>

//                 <div className="form-container sign-in-container">
//                     <form onSubmit={(e) => e.preventDefault()}>
//                         <h1>Sign in</h1>
//                         <div className="social-container">
//                             <button className="social" onClick={() => console.log("Facebook icon clicked!")}>
//                                 <i className="fab fa-facebook-f"></i>
//                             </button>
//                             <button className="social" onClick={() => console.log("Google icon clicked!")}>
//                                 <i className="fab fa-google"></i>
//                             </button>
//                             <button className="social" onClick={() => console.log("LinkedIn icon clicked!")}>
//                                 <i className="fab fa-linkedin-in"></i>
//                             </button>
//                         </div>
//                         <span>or use your account</span>
//                         <div className="infield">
//                             <input type="email" placeholder="Email" name="email" />
//                             <label></label>
//                         </div>
//                         <div className="infield">
//                             <input type="password" placeholder="Password" />
//                             <label></label>
//                         </div>
//                         <a href="#" className="forgot">Forgot your password?</a>
//                         <button type="submit">Sign In</button>
//                     </form>
//                 </div>

//                 <div className="overlay-container" id="overlayCon">
//                     <div className="overlay">
//                         <div className="overlay-panel overlay-left">
//                             <h1>Welcome Back!</h1>
//                             <p>To keep connected with us please login with your personal info</p>
//                             <button onClick={() => document.getElementById("container").classList.remove("right-panel-active")}>
//                                 Sign In
//                             </button>
//                         </div>
//                         <div className="overlay-panel overlay-right">
//                             <h1>Hello, Friend!</h1>
//                             <p>Enter your personal details and start your journey with us</p>
//                             <button onClick={() => document.getElementById("container").classList.add("right-panel-active")}>
//                                 Sign Up
//                             </button>
//                         </div>
//                     </div>
//                     <button id="overlayBtn" ref={overlayBtnRef}></button>
//                 </div>
//             </div>

//             <footer></footer>
//         </>
//     );
// }


// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect, useState } from "react";

// const Login = () => {
//   const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
//   const [backendToken, setBackendToken] = useState(null);

//   useEffect(() => {
//     const authenticateWithBackend = async () => {
//       if (isAuthenticated && user) {
//         try {
//           const email = user.email;

//           // 🔹 Determine role (assuming frontend sets this)
//           const role = email.includes("admin") ? "admin" : "user";

//           // 🔹 Send login request to backend using Fetch API
//           const response = await fetch("http://localhost:3000/api/user/login", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, role }),
//           });

//           if (!response.ok) {
//             throw new Error(`Login failed: ${response.statusText}`);
//           }

//           const data = await response.json();
//           setBackendToken(data.token);

//           console.log("Logged in successfully:", data);
//         } catch (error) {
//           console.error("Login failed:", error.message);
//         }
//       }
//     };

//     authenticateWithBackend();
//   }, [isAuthenticated, user]);

//   return (
//     <div>
//       {isAuthenticated ? (
//         <>
//           <h2>Welcome, {user.name}</h2>
//           <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
//         </>
//       ) : (
//         <button onClick={() => loginWithRedirect()}>Login</button>
//       )}
//     </div>
//   );
// };

// export default Login;







import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

const loginUser = async (email, password, role) => {
  try {
    const endpoint = "http://localhost:3000/FinCtrl/user/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token); // Store JWT
    console.log("Login successful:", data);
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const data = await loginUser(formData.email, formData.password, formData.role);
      if (data) navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Card with subtle shadow and rounded corners */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-100">Sign in to continue to your account</p>
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Password Field */}
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              
              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Login As
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </button>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
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
                    Sign In <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
              Don't have an account?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
