import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { LoadingIcon } from "../components/ui/loading-icon";

const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    picture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        picture: data.picture || null,
      });
      setPreview(data.picture || null);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.picture) localStorage.setItem("userPic", data.picture);
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData((prev) => ({ ...prev, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to update your profile.");

      const response = await fetch("https://fin-ctrl-1.onrender.com/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          picture: formData.picture,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      if (formData.picture) localStorage.setItem("userPic", formData.picture);
      alert("Profile updated successfully!");
    } catch (error) {
      setError(error.message || "Failed to update profile.");
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
          <h1 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Profile Settings
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
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
                <h2 className="text-2xl font-semibold text-gray-800">{formData.username}</h2>
                <p className="text-gray-500 text-sm mt-1">{formData.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
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