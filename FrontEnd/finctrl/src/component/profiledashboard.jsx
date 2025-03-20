import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { LoadingIcon } from "../components/ui/loading-icon";
import Compressor from "compressorjs";

const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    adminName: "",
    email: "",
    picture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const navigate = useNavigate();

  const generateAvatar = (name) => {
    if (!name) return null;
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = [
      '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
      '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
      '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
      '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(75, 75, 75, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(firstLetter, 75, 75);
    
    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view your profile.");

      const response = await fetch("https://fin-ctrl-1.onrender.com/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        if (response.status === 404) throw new Error("Profile not found.");
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile data from GET:", data); // Debug initial load
      setUser(data);
      setRole(data.role || localStorage.getItem("role") || "user");
      setFormData({
        username: data.username || "",
        adminName: data.adminName || "",
        email: data.email || "",
        picture: data.picture || null,
      });
      
      // Generate avatar if no picture exists
      const name = role === "admin" ? data.adminName : data.username;
      const avatar = data.picture || generateAvatar(name);
      setPreview(avatar);
      
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role || "user");
      if (avatar) localStorage.setItem("userPic", avatar);
    } catch (error) {
      setError(error.message || "Failed to load profile.");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update avatar when name changes
    if ((name === "username" || name === "adminName") && !formData.picture) {
      const newName = name === "username" ? value : formData.username;
      const avatar = generateAvatar(newName);
      setPreview(avatar);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        maxHeight: 800,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          console.log("Compressed image size:", base64Image.length / 1024, "KB"); // Debug image size
          setPreview(base64Image);
          setFormData((prev) => ({ ...prev, picture: base64Image }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setError("Failed to compress image: " + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to update your profile.");

      // Generate new avatar if name changed and no picture exists
      const name = role === "admin" ? formData.adminName : formData.username;
      const avatar = formData.picture || generateAvatar(name);

      const payload = {
        email: formData.email,
        picture: avatar,
        ...(role === "admin" ? { adminName: formData.adminName } : { username: formData.username }),
      };

      const payloadString = JSON.stringify(payload);
      console.log("Sending payload:", payload); // Debug payload before sending
      console.log("Payload size:", payloadString.length / 1024, "KB");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://fin-ctrl-1.onrender.com/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Response status:", response.status, "Response text:", errorData);
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        if (response.status === 413) throw new Error("Payload too large. Reduce image size.");
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log("Updated user from PUT:", updatedUser); // Debug response
      setUser(updatedUser.user);
      setFormData({
        username: updatedUser.user.username || "",
        adminName: updatedUser.user.adminName || "",
        email: updatedUser.user.email || "",
        picture: updatedUser.user.picture || null,
      });
      setPreview(updatedUser.user.picture || generateAvatar(role === "admin" ? updatedUser.user.adminName : updatedUser.user.username));
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      localStorage.setItem("role", role);
      if (updatedUser.user.picture) localStorage.setItem("userPic", updatedUser.user.picture);
      alert("Profile updated successfully!");
    } catch (error) {
      if (error.name === "AbortError") {
        setError("Request timed out. Try a smaller image or check your connection.");
      } else if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        setError("Network error: Could not connect to the server. Check your internet or server status.");
      } else {
        setError(error.message || "Failed to update profile.");
      }
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
          <LoadingIcon size={58} color="border-l-indigo-500" />
          <p className="text-gray-600 animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-800 bg-clip-text  bg-gradient-to-r from-blue-600 to-indigo-600">
            Profile Settings
          </h1>
          <button
            onClick={() => navigate(/*role === "admin" ? "/admin-dashboard" : */ "/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Back to {role === "admin" ? "Admin Dashboard" : "Dashboard"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture and Info */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm group-hover:border-blue-300 transition-all duration-200"
                />
                <label
                  htmlFor="profile-pic"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-md group-hover:scale-110"
                >
                  <Camera size={20} />
                  <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {role === "admin" ? formData.adminName || "Admin" : formData.username || "User"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{formData.email || "No email set"}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {role === "admin" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50"
                    placeholder="Your admin name"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50"
                    placeholder="Your username"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save size={20} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;