import { useState } from "react";
import { useNavigate } from "react-router-dom";

const registerUser = async (userData, role) => {
  const endpoint =
    role === "admin"
      ? "http://localhost:3000/FinCtrl/admin/register"
      : "http://localhost:3000/FinCtrl/user/register";

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
  }
};

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "", // User's name
    adminName: "", // Admin's name (if role is Admin)
    email: "",
    password: "",
    passForUser: "", // Required only for Admins
    admin: "", // Required only for Users
    role: "user", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(formData, formData.role);
    if (data) navigate("/login"); // Redirect to login after successful signup
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Signup</h2>

        {formData.role === "user" && (
          <>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
            <input type="text" name="admin" placeholder="Admin ID" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
          </>
        )}

        {formData.role === "admin" && (
          <>
            <input type="text" name="adminName" placeholder="Admin Name" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
            <input type="password" name="passForUser" placeholder="Pass for Users" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
          </>
        )}

        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 mb-3 border rounded" />
        
        <select name="role" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Signup</button>
      </form>

      <p className="mt-4 text-gray-600">Already have an account?</p>
      <button onClick={() => navigate("/login")} className="mt-2 text-blue-500 hover:underline">Login</button>
    </div>
  );
};

export default Signup;
