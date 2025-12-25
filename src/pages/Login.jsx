// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, forgotPassword } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

import logo from "../assets/logo.png";
import illustration from "../assets/illustration.png";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login"); // "Login" | "Sign Up"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const onChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const res = await register(formData);

        if (!res || res.error) {
          toast.error(res?.error || "Signup failed");
        } else {
          toast.success(res.message || "Registration successful! Please login.");
          setCurrentState("Login");
          setFormData({ name: "", email: "", password: "" });
        }
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });

        if (!res || res.error) {
          toast.error(res?.error || "Login failed");
        } else {
          if (res.token) localStorage.setItem("token", res.token);
          if (setUser && res.user) setUser(res.user);

          toast.success(res.message || "Login successful!");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }
    setForgotPasswordLoading(true);

    const res = await forgotPassword(forgotPasswordEmail);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message || "Reset link sent");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }

    setForgotPasswordLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-200 flex flex-col overflow-hidden">
        {/* PAGE HEADER */}
        <header className="w-full bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg animate-headerIn">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevSphere"
              className="w-16 h-16 object-contain shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-1 animate-logoPop"
            />
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md">
              Dev<span className="text-cyan-300">Sphere</span>
            </h1>
          </div>
          <p className="hidden md:block text-slate-200 text-sm tracking-wide">
            Developer Collaboration Platform
          </p>
        </header>

        {/* MAIN CARD */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 fade-in-up">
          <div className="w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT SIDE – Illustration */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-slate-900 to-slate-950 items-center justify-center relative px-8 py-10">
              <div className="absolute -top-10 right-4 w-60 h-60 bg-cyan-400/25 rounded-full blur-3xl" />
              <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500/10 rounded-[2.5rem] blur-3xl" />

              <div className="illustration-slide relative z-10 flex flex-col items-end gap-5 mr-2">
                <div className="relative bg-slate-950/60 rounded-[2rem] border border-slate-700/70 shadow-[0_18px_45px_rgba(0,0,0,0.55)] p-4 -mt-4">
                  <img
                    src={illustration}
                    alt="DevSphere illustration"
                    className="w-[320px] h-auto rounded-[1.6rem] object-contain"
                  />
                </div>

                <p className="text-slate-200 text-sm max-w-xs text-right leading-relaxed animate-textFade">
                  Build portfolios, join live coding rooms, and collaborate in
                  real time — all inside DevSphere.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE – FORM */}
            <div className="w-full md:w-1/2 bg-slate-900 px-6 md:px-10 py-8 flex flex-col justify-center gap-6 animate-formFadeIn">
              <div>
                <p className="text-xs tracking-[0.4em] text-cyan-200 uppercase">
                  Welcome back
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2 leading-tight">
                  Sign in to your developer space
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  {currentState === "Login"
                    ? "Use your email and password to continue."
                    : "Create an account to start collaborating."}
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                {currentState === "Sign Up" && (
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-200 text-sm">Full name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChangeHandler}
                      placeholder="John Doe"
                      className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-slate-200 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    placeholder="you@example.com"
                    className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-200 text-sm">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={onChangeHandler}
                      placeholder="••••••••"
                      className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {!showPassword ? (
                        // Eye (hidden)
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        // Eye Off (visible)
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8a10.94 10.94 0 0 1 5.06-5.94" />
                          <path d="M1 1l22 22" />
                          <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                          <path d="M12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.29 3.95" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-cyan-200 hover:text-white transition"
                  >
                    Forgot password?
                  </button>

                  {currentState === "Login" ? (
                    <span
                      onClick={() => setCurrentState("Sign Up")}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      Create account
                    </span>
                  ) : (
                    <span
                      onClick={() => setCurrentState("Login")}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      Already have an account?
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-cyan-400 text-slate-900 font-semibold py-2 rounded-lg shadow transition-all duration-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed animate-buttonGlow"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Processing..."
                      : currentState === "Login"
                      ? "Sign In"
                      : "Sign Up"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 hover:opacity-40 animate-gradientMove" />
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* ✅ NON-FIXED FOOTER (everything clickable, no layout change) */}
        <footer className="w-full bg-slate-900 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="footer-wrap">
              {/* clickable tagline */}
              <Link to="/" className="footer-linkBlock">
                <p className="footer-tagline">
                  Developer Collaboration & Portfolio Platform
                </p>
              </Link>

              {/* clickable copyright */}
              <Link to="/" className="footer-linkBlock">
                <p className="footer-copy">
                  © {new Date().getFullYear()} DevSphere
                </p>
              </Link>

              {/* clickable menu */}
              <div className="footer-links">
                <Link to="/privacy" className="footer-link">
                  Privacy
                </Link>
                <span className="footer-sep">|</span>
                <Link to="/terms" className="footer-link">
                  Terms
                </Link>
                <span className="footer-sep">|</span>
                <Link to="/support" className="footer-link footer-link-accent">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Reset password
                </h3>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-slate-400 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
                <input
                  type="email"
                  className="form-input bg-slate-800/70 border border-slate-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="you@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition disabled:opacity-50"
                  >
                    {forgotPasswordLoading ? "Sending..." : "Send link"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ANIMATIONS + FOOTER CSS */}
      <style>{`
        @keyframes slideFromLeftSlow {
          0% { opacity: 0; transform: translateX(-180px); }
          60% { opacity: 0.9; transform: translateX(20px); }
          80% { transform: translateX(-5px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .illustration-slide { animation: slideFromLeftSlow 2s ease-out both; }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 1.2s ease forwards; }

        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 0px rgba(34,211,238,0); }
          50% { box-shadow: 0 0 20px rgba(34,211,238,0.6); }
        }
        .animate-buttonGlow { animation: buttonGlow 4s ease-in-out infinite; }

        @keyframes gradientMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gradientMove { animation: gradientMove 3s linear infinite; }

        @keyframes logoPop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-logoPop { animation: logoPop 1s ease-out forwards; }

        @keyframes headerIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-headerIn { animation: headerIn 0.9s ease-out forwards; }

        @keyframes textFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-textFade { animation: textFade 2.5s ease forwards; }

        @keyframes formFadeIn {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-formFadeIn { animation: formFadeIn 1s ease-out forwards; }

        /* Footer */
        .footer-wrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:6px;
          text-align:center;
          animation: footerFadeIn 0.9s ease-out both;
        }
        .footer-linkBlock{
          text-decoration: none;
          display: inline-block;
        }
        .footer-linkBlock:hover .footer-tagline,
        .footer-linkBlock:hover .footer-copy{
          color: #fff;
          transform: translateY(-1px);
        }

        .footer-tagline{
          color: rgba(226,232,240,0.85);
          font-size: 13px;
          letter-spacing: 0.02em;
          transform: translateY(10px);
          opacity: 0;
          transition: 250ms ease;
          animation: footerSlideUp 0.9s ease-out 0.05s both;
        }
        .footer-copy{
          color: rgba(148,163,184,0.9);
          font-size: 12px;
          transform: translateY(10px);
          opacity: 0;
          transition: 250ms ease;
          animation: footerSlideUp 0.9s ease-out 0.15s both;
        }
        .footer-links{
          display:flex;
          align-items:center;
          gap:10px;
          margin-top: 6px;
          transform: translateY(10px);
          opacity: 0;
          animation: footerSlideUp 0.9s ease-out 0.25s both;
        }
        .footer-link{
          color: rgba(148,163,184,0.95);
          font-size: 13px;
          cursor: pointer;
          transition: color 250ms ease, transform 250ms ease;
          text-decoration: none;
        }
        .footer-link:hover{
          color: #ffffff;
          transform: translateY(-1px);
        }
        .footer-link-accent{ color: rgba(34,211,238,0.95); }
        .footer-link-accent:hover{ color: #ffffff; }
        .footer-sep{ color: rgba(71,85,105,1); font-size: 12px; }

        @keyframes footerFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes footerSlideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default Login;