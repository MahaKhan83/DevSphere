import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, forgotPassword } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

import logo from "../assets/logo.png";
import illustration from "../assets/illustration.png";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

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
        if (!res || res.error) toast.error(res?.error || "Signup failed");
        else {
          toast.success("Registration successful! Please login.");
          setCurrentState("Login");
          setFormData({ name: "", email: "", password: "" });
        }
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
        });
        if (!res || res.error) toast.error(res?.error || "Login failed");
        else {
          if (res.token) localStorage.setItem("token", res.token);
          if (setUser && res.user) setUser(res.user);
          toast.success(res.message || "Login successful!");
          navigate("/");
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
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res.message || "Reset link sent");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }
    setForgotPasswordLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-200 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="w-full bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg animate-headerIn">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevSphere"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 animate-logoPop"
            />
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md ml-2">
              Dev<span className="text-cyan-300">Sphere</span>
            </h1>
          </div>
          <p className="hidden md:block text-slate-200 text-sm tracking-wide">
            Developer Collaboration Platform
          </p>
        </header>

        {/* MAIN SECTION */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 fade-in-up">
          <div className="w-full max-w-5xl flex flex-col md:flex-row bg-slate-900 rounded-3xl shadow-2xl border-[5px] border-slate-800 overflow-hidden min-h-[520px] transition-all duration-1000 hover:shadow-cyan-500/20">
            {/* LEFT SIDE - Illustration */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-slate-900 to-slate-950 items-center justify-center relative p-8 overflow-hidden">
              <div className="absolute -top-16 -right-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-glowPulse" />
              <div className="illustration-slide relative z-10 flex flex-col items-center gap-4">
                <div className="w-72 h-72 flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.35)] bg-slate-950/40 border border-slate-600/60 transition-transform duration-700 hover:-translate-y-1 hover:scale-105 animate-float">
                  <img
                    src={illustration}
                    alt="DevSphere Illustration"
                    className="w-[270px] rounded-2xl"
                  />
                </div>
                <p className="text-slate-200 text-sm text-center leading-relaxed max-w-xs animate-textFade">
                  Build portfolios, join live coding rooms, and collaborate in
                  real time — all inside DevSphere.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
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
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    placeholder="••••••••"
                    className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
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
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 hover:opacity-40 animate-gradientMove"></div>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        /* Slide in from left + slow motion */
        @keyframes slideFromLeftSlow {
          0% { opacity: 0; transform: translateX(-180px); }
          60% { opacity: 0.9; transform: translateX(20px); }
          80% { transform: translateX(-5px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .illustration-slide { animation: slideFromLeftSlow 2s ease-out both; }

        /* Floating loop */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        /* Glow pulse */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-glowPulse { animation: glowPulse 3s ease-in-out infinite; }

        /* Form fade */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 1.2s ease forwards; }

        /* Button glowing pulse */
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 0px rgba(34,211,238,0); }
          50% { box-shadow: 0 0 20px rgba(34,211,238,0.6); }
        }
        .animate-buttonGlow { animation: buttonGlow 4s ease-in-out infinite; }

        /* Gradient shimmer */
        @keyframes gradientMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gradientMove { animation: gradientMove 3s linear infinite; }

        /* Logo + header fade */
        @keyframes logoPop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-logoPop { animation: logoPop 1s ease-out forwards; }
        .animate-headerIn { animation: fadeInUp 1.5s ease-out forwards; }

        /* Text fade-in */
        @keyframes textFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-textFade { animation: textFade 2.5s ease forwards; }
      `}</style>
    </>
  );
};

export default Login;