import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

// ✅ ENV support (fallback same as before)
const API_BASE_URL =
  (import.meta?.env?.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000") +
  "/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- Password Strength (UI only) ---------- */
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;

    const label =
      score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
    return { width: `${(score / 5) * 100}%`, label };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 1. PEHLE REQUIRED FIELDS CHECK
    if (!password.trim()) {
      return toast.error("Password is required");
    }
    
    if (!confirmPassword.trim()) {
      return toast.error("Confirm password is required");
    }

    // ✅ 2. TOKEN CHECK
    if (!token) return toast.error("Invalid or missing reset token");
    
    // ✅ 3. PASSWORD LENGTH CHECK
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    
    // ✅ 4. PASSWORD MATCH CHECK
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    // ✅ 5. PASSWORD STRENGTH CHECK
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      return toast.error("Password must contain uppercase, lowercase letters and numbers");
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        { password, confirmPassword } // ✅ dono fields bhejo
      );

      toast.success("Password reset successfully");

      // ✅ small clean up (no UI change)
      setPassword("");
      setConfirmPassword("");

      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.response?.data?.error || "Invalid or expired reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DevSphere"
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
          <h1 className="text-white text-xl md:text-2xl font-bold tracking-wide">
            Dev<span className="text-cyan-300">Sphere</span>
          </h1>
        </div>

        <p className="hidden md:block text-slate-300 text-sm">
          Secure Account Recovery
        </p>
      </header>

      {/* 🔹 PAGE */}
      <div className="min-h-screen bg-[#eef3f7] flex items-center justify-center px-4 pt-32 relative">
        {/* 🔹 Static Background */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="staticBlob blob1" />
          <div className="staticBlob blob2" />
          <div className="staticGrid" />
        </div>

        {/* 🔹 Card */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-2xl overflow-hidden cardIn">
          {/* Card Header */}
          <div className="relative px-6 py-6 bg-slate-900 text-white">
            <div className="navyUnderline" />
            <p className="text-xs tracking-[0.35em] uppercase text-slate-300">
              DevSphere Security
            </p>
            <h2 className="mt-2 text-2xl font-bold">Reset Password</h2>
            <p className="text-sm text-slate-300 mt-1">
              Choose a strong new password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-slate-800">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200
                             focus:ring-2 focus:ring-sky-600 focus:border-sky-600
                             outline-none text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-full
                             bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength */}
              <div className="mt-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 transition-all"
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Strength: <b>{strength.label}</b>
                </p>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 rounded-xl border outline-none
                    ${password && confirmPassword && password !== confirmPassword 
                      ? "border-red-500 focus:ring-2 focus:ring-red-500" 
                      : "border-slate-200 focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                    } text-slate-900`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-full
                             bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              
              {/* ✅ Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <div className="mt-2">
                  {password === confirmPassword ? (
                    <div className="flex items-center text-green-600 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (password && confirmPassword && password !== confirmPassword)}
              className={`w-full py-3 rounded-xl font-semibold text-white transition
                ${
                  loading || (password && confirmPassword && password !== confirmPassword)
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700 active:scale-[0.99]"
                }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Links */}
            <div className="flex justify-between text-sm pt-2">
              <Link to="/login" className="text-sky-700 font-semibold hover:underline">
                ← Login
              </Link>
              <Link to="/" className="text-slate-600 hover:underline">
                Home
              </Link>
            </div>
          </form>
        </div>

        {/* 🔹 Styles */}
        <style>{`
          .cardIn{
            animation: fadeUp .6s ease-out both;
          }
          @keyframes fadeUp{
            from{opacity:0; transform:translateY(14px)}
            to{opacity:1; transform:translateY(0)}
          }

          .staticBlob{
            position:absolute;
            border-radius:999px;
            filter: blur(100px);
            background: rgba(12,42,92,.25);
          }
          .blob1{ width:600px;height:600px;top:-200px;left:-200px; }
          .blob2{ width:600px;height:600px;bottom:-220px;right:-220px; }

          .staticGrid{
            position:absolute; inset:0;
            background-image:
              linear-gradient(to right, rgba(12,42,92,.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(12,42,92,.15) 1px, transparent 1px);
            background-size:64px 64px;
            opacity:.08;
          }

          .navyUnderline{
            position:absolute;
            left:0; right:0; bottom:0;
            height:2px;
            background:linear-gradient(90deg,
              rgba(12,42,92,0),
              rgba(56,189,248,.8),
              rgba(12,42,92,0)
            );
          }
        `}</style>
      </div>
    </>
  );
}