import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api"; // adjust path if needed

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ PASSWORD VALIDATION ADD KARO (Yahi change karna hai)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    // ✅ Email format validation (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // ✅ Name validation (optional)
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await signupUser(formData);
      if (res.success) {
        navigate("/login");
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Password strength indicator (optional but good)
  const getPasswordStrength = () => {
    const length = formData.password.length;
    if (length === 0) return "";
    if (length < 8) return "text-red-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          Dev<span className="text-sky-400">Sphere</span>
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Create your developer account
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-slate-300 text-sm mb-2 font-medium"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-slate-300 text-sm mb-2 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-slate-300 text-sm mb-2 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="•••••••• (min 8 characters)"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {/* ✅ Password length indicator (optional) */}
            <div className="mt-1 flex justify-between">
              <span className={`text-xs ${getPasswordStrength()}`}>
                {formData.password.length < 8 
                  ? `Too short (${formData.password.length}/8)` 
                  : "✓ Good length"}
              </span>
              <span className="text-xs text-slate-500">
                {formData.password.length} characters
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 transition-all duration-200 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-sky-400 hover:text-sky-300 cursor-pointer font-medium"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;