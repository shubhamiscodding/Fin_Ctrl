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

const loginUser = async (email, password, role) => {
  try {
    const endpoint ="http://localhost:3000/FinCtrl/user/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password,role }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token); // Store JWT
    console.log("Login successful:", data);
    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
  }
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(formData.email, formData.password, formData.role);
    if (data) navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
        
        <select name="role" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
      </form>

      <p className="mt-4 text-gray-600">Don't have an account?</p>
      <button onClick={() => navigate("/signup")} className="mt-2 text-blue-500 hover:underline">Signup</button>
    </div>
  );
};

export default Login;
