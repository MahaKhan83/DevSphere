import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, forgotPassword } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

import logo from "../assets/logo.png";
import illustration from "../assets/illustration.png";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login"); // "Login" | "Sign Up"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // ✅ only ONE visibility state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const onChangeHandler = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
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
          setIsPasswordVisible(false);
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
    try {
      const res = await forgotPassword(forgotPasswordEmail);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(res.message || "Reset link sent");
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setForgotPasswordLoading(false);
    }
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
                  Build portfolios, join live coding rooms, and collaborate in real time — all inside DevSphere.
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

                {/* ✅ PASSWORD (FIXED: two inputs + key forces re-mount) */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-200 text-sm">Password</label>

                  <div className="relative isolate">
                    {isPasswordVisible ? (
                      <input
                        key="password-text"
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={onChangeHandler}
                        placeholder="Enter password"
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        autoComplete="off"
                        required
                      />
                    ) : (
                      <input
                        key="password-hidden"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChangeHandler}
                        placeholder="••••••••"
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        autoComplete="current-password"
                        required
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                      title={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                      {isPasswordVisible ? (
                        // Eye icon - when password IS visible, show "eye" (means you can hide it)
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
                        // Eye Off icon - when password is NOT visible, show "eye off" (means you can show it)
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
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState("Sign Up");
                        setIsPasswordVisible(false);
                      }}
                      className="text-slate-300 hover:text-white transition"
                    >
                      Create account
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState("Login");
                        setIsPasswordVisible(false);
                      }}
                      className="text-slate-300 hover:text-white transition"
                    >
                      Already have an account?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full bg-cyan-400 text-slate-900 font-semibold py-2 rounded-lg shadow transition-all duration-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* FOOTER (NON-FIXED) */}
        <footer className="w-full bg-slate-900 border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-4">
                  <div className="footer-wrap">
                    <Link to="/" className="footer-linkBlock">
                      <p className="footer-tagline">
                        Developer Collaboration & Portfolio Platform
                      </p>
                    </Link>
        
                    <Link to="/" className="footer-linkBlock">
                      <p className="footer-copy">
                        © {new Date().getFullYear()} DevSphere
                      </p>
                    </Link>
        
                    <div className="footer-links">
                      <Link to="/privacy" className="footer-link">Privacy</Link>
                      <span className="footer-sep">|</span>
                      <Link to="/terms" className="footer-link">Terms</Link>
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
                <h3 className="text-lg font-semibold text-white">Reset password</h3>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-slate-400 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Enter your email and we will send you a reset link.
                </p>

                <input
                  type="email"
                  className="bg-slate-800/70 border border-slate-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="you@example.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="button"

                    onClick={() => navigate("/reset-password")}
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
    </>
  );
};

export default Login;