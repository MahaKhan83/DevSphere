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

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (password.length === 0) return { strength: "none", message: "" };
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecial) {
      return { strength: "strong", message: "Strong password ✓" };
    } else if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
      return { strength: "normal", message: "Good password ✓" };
    } else if (password.length >= 8) {
      return { strength: "weak", message: "Weak - add uppercase, lowercase & numbers" };
    } else {
      return { strength: "too-weak", message: `Too short (${password.length}/8)` };
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ 1. PEHLE REQUIRED FIELDS CHECK
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("All fields are required");
      return;
    }
    
    // ✅ 2. PHIR NAME VALIDATION
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    
    // ✅ 3. PHIR EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // ✅ 4. PHIR PASSWORD LENGTH CHECK
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    // ✅ 5. PASSWORD STRENGTH CHECK
    if (passwordStrength.strength === "weak" || passwordStrength.strength === "too-weak") {
      setError("Password is too weak. Use uppercase, lowercase letters and numbers");
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

  // Strength bar color
  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case "strong": return "bg-green-500";
      case "normal": return "bg-yellow-500";
      case "weak": return "bg-red-500";
      case "too-weak": return "bg-red-500";
      default: return "bg-slate-700";
    }
  };

  // Strength text color
  const getStrengthTextColor = () => {
    switch (passwordStrength.strength) {
      case "strong": return "text-green-500";
      case "normal": return "text-yellow-500";
      case "weak": return "text-red-500";
      case "too-weak": return "text-red-500";
      default: return "text-slate-400";
    }
  };

  // Fill strength bars
  const getStrengthBars = () => {
    switch (passwordStrength.strength) {
      case "strong": return 3;
      case "normal": return 2;
      case "weak": return 1;
      case "too-weak": return 1;
      default: return 0;
    }
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
            
            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Password strength:</span>
                  <span className={`text-xs font-medium ${getStrengthTextColor()}`}>
                    {passwordStrength.strength === "strong" ? "STRONG" :
                     passwordStrength.strength === "normal" ? "NORMAL" :
                     passwordStrength.strength === "weak" ? "WEAK" :
                     "TOO WEAK"}
                  </span>
                </div>
                
                {/* Strength Bars */}
                <div className="flex h-1.5 space-x-1 mb-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`flex-1 rounded-full ${
                        bar <= getStrengthBars() ? getStrengthColor() : "bg-slate-700"
                      }`}
                    ></div>
                  ))}
                </div>
                
                {/* Strength Message */}
                <p className={`text-xs ${getStrengthTextColor()}`}>
                  {passwordStrength.message}
                  {formData.password.length > 0 && (
                    <span className="text-slate-500 ml-2">
                      ({formData.password.length} characters)
                    </span>
                  )}
                </p>
                
                {/* Password Requirements */}
                {passwordStrength.strength === "weak" && (
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <p>Requirements:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li className={formData.password.length >= 8 ? "text-green-500" : "text-red-500"}>
                        At least 8 characters {formData.password.length >= 8 ? "✓" : "✗"}
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-red-500"}>
                        Uppercase letter {/[A-Z]/.test(formData.password) ? "✓" : "✗"}
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? "text-green-500" : "text-red-500"}>
                        Lowercase letter {/[a-z]/.test(formData.password) ? "✓" : "✗"}
                      </li>
                      <li className={/\d/.test(formData.password) ? "text-green-500" : "text-red-500"}>
                        Number {/\d/.test(formData.password) ? "✓" : "✗"}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
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