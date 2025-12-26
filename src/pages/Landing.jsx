// src/pages/Landing.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import illustration from "../assets/illustration2.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg w-screen">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DevSphere"
            className="w-14 h-14 md:w-16 md:h-16 object-contain shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-1"
          />

          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md">
            Dev<span className="text-cyan-300">Sphere</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-sm md:text-base font-medium shadow-md transition-all duration-300 hover:shadow-sky-500/40 hover:-translate-y-[2px] active:translate-y-[1px]"
        >
          Log in
        </button>
      </header>

      {/* MAIN SECTION */}
      <div className="min-h-screen w-screen bg-[#eef3f7] pt-32 flex flex-col overflow-x-hidden">
        <main className="flex-1 w-screen flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 px-6 md:px-16 pb-10">
          
          {/* LEFT CONTENT */}
          <section className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <p className="text-xs tracking-[0.35em] text-slate-500 uppercase fadeUp-1">
              Developer Platform
            </p>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight fadeUp-2">
              Build faster.
              <span className="block text-sky-600">Collaborate smarter.</span>
            </h1>

            <p className="text-slate-700 text-sm md:text-lg max-w-xl md:max-w-md mx-auto md:mx-0 fadeUp-3">
              A modern workspace where teams code, collaborate, and ship together — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start fadeUp-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-full bg-sky-600 text-white text-sm md:text-base font-semibold shadow-md transition-all duration-300 hover:bg-sky-500 hover:shadow-sky-400/50 hover:-translate-y-[2px] active:translate-y-[1px]"
              >
                Get started
              </button>

              <button className="px-6 py-3 rounded-full border border-slate-400 text-slate-800 text-sm md:text-base bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-500 transition-all duration-300 hover:-translate-y-[2px]">
                Explore features
              </button>
            </div>
          </section>

          {/* RIGHT ILLUSTRATION */}
          <section className="w-full md:w-1/2 flex justify-end items-center">
            <div className="max-w-md w-full flex justify-end">
              <img
                src={illustration}
                alt="DevSphere Illustration"
                className="w-full h-auto max-h-[380px] object-contain rounded-3xl shadow-xl"
              />
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
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

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fadeUp-1 { animation: fadeUp 0.8s ease-out forwards; }
        .fadeUp-2 { animation: fadeUp 1s ease-out forwards; }
        .fadeUp-3 { animation: fadeUp 1.2s ease-out forwards; }
        .fadeUp-4 { animation: fadeUp 1.4s ease-out forwards; }

        .footer-wrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          text-align:center;
        }
        .footer-tagline{
          color: rgba(226,232,240,0.85);
          font-size: 13px;
        }
        .footer-copy{
          color: rgba(148,163,184,0.9);
          font-size: 12px;
        }
        .footer-links{
          display:flex;
          gap:10px;
          margin-top: 6px;
        }
        .footer-link{
          color: rgba(148,163,184,0.95);
          font-size: 13px;
          text-decoration:none;
          transition: color 0.3s ease;
        }
        .footer-link:hover{
          color:#fff;
        }
        .footer-link-accent{
          color: rgba(34,211,238,0.95);
        }
        .footer-sep{
          color: rgba(71,85,105,1);
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default Landing;
