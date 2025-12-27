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

        {/* underline glow */}
        <div className="navyGlowLine" />
      </header>

      {/* BACKGROUND FX */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="sfBlob sfBlob1" />
        <div className="sfBlob sfBlob2" />
        <div className="sfBlob sfBlob3" />
        <div className="sfShimmer" />
        <div className="sfGrain" />
      </div>

      {/* MAIN */}
      <div className="min-h-screen w-screen bg-[#eef3f7] pt-32 flex flex-col overflow-x-hidden">
        <main className="flex-1 w-screen flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 px-6 md:px-16 pb-10">
          {/* LEFT */}
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
                className="px-6 py-3 rounded-full bg-sky-600 text-white text-sm md:text-base font-semibold shadow-md transition-all duration-300 hover:bg-sky-500 hover:shadow-sky-400/50 hover:-translate-y-[2px] active:translate-y-[1px] navyBtnGlow"
              >
                Get started
              </button>

              {/* ✅ UPDATED: Explore Features clickable */}
              <button
                onClick={() => navigate("/features")}
                className="px-6 py-3 rounded-full border border-slate-400 text-slate-800 text-sm md:text-base bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-500 transition-all duration-300 hover:-translate-y-[2px] navyBtnGlowSoft"
              >
                Explore features
              </button>
            </div>
          </section>

          {/* RIGHT */}
          <section className="w-full md:w-1/2 flex justify-end items-center">
            <div className="max-w-md w-full flex justify-end">
              <div className="illWrap">
                <img
                  src={illustration}
                  alt="DevSphere Illustration"
                  className="w-full h-auto max-h-[380px] object-contain rounded-3xl shadow-xl"
                />
                <div className="illRing" />
                <div className="illRing2" />
              </div>
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

      {/* STYLES & ANIMATIONS */}
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

        .navyGlowLine{
          position:absolute;
          left:0; right:0; bottom:-1px;
          height:2px;
          background: linear-gradient(90deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,0.85) 30%,
            rgba(56,189,248,0.65) 50%,
            rgba(12,42,92,0.85) 70%,
            rgba(12,42,92,0) 100%
          );
          animation: glowSweep 3.8s ease-in-out infinite;
        }
        @keyframes glowSweep{
          0%{ opacity:.25; transform: translateX(-18%); }
          50%{ opacity:.85; transform: translateX(18%); }
          100%{ opacity:.25; transform: translateX(-18%); }
        }

        .sfBlob{
          position:absolute;
          border-radius:999px;
          filter: blur(95px);
          opacity:.55;
          animation: sfFloat 12s ease-in-out infinite;
          background: radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.9),
            rgba(6,22,58,.55),
            rgba(3,12,28,0)
          );
        }
        .sfBlob1{ left:-220px; top:-220px; width:680px; height:680px; }
        .sfBlob2{ right:-260px; bottom:-320px; width:760px; height:760px; opacity:.45; animation-duration:16s; }
        .sfBlob3{ left:20%; bottom:-360px; width:700px; height:700px; opacity:.3; animation-duration:20s; }

        .sfShimmer{
          position:absolute;
          inset:-10px;
          background: linear-gradient(120deg,
            rgba(3,12,28,0) 0%,
            rgba(12,42,92,.28) 40%,
            rgba(56,189,248,.18) 50%,
            rgba(3,12,28,0) 72%
          );
          opacity:.7;
          transform: translateX(-45%) skewX(-10deg);
          animation: sfSweep 6.2s ease-in-out infinite;
        }

        .sfGrain{
          position:absolute;
          inset:0;
          opacity:.1;
          pointer-events:none;
        }

        @keyframes sfFloat{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(40px,-30px) scale(1.08); }
          100%{ transform: translate(0,0) scale(1); }
        }
        @keyframes sfSweep{
          0%{ transform: translateX(-55%) skewX(-10deg); opacity:.35; }
          50%{ transform: translateX(35%) skewX(-10deg); opacity:.9; }
          100%{ transform: translateX(-55%) skewX(-10deg); opacity:.35; }
        }

        .navyBtnGlow, .navyBtnGlowSoft{ position:relative; overflow:hidden; }
        .navyBtnGlow::after,
        .navyBtnGlowSoft::after{
          content:"";
          position:absolute;
          inset:-2px;
          background: linear-gradient(90deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,.35) 50%,
            rgba(12,42,92,0) 100%
          );
          transform: translateX(-60%);
          animation: btnSheen 3.8s ease-in-out infinite;
        }
        @keyframes btnSheen{
          0%{ transform: translateX(-70%); }
          50%{ transform: translateX(70%); }
          100%{ transform: translateX(-70%); }
        }

        .illWrap{ position:relative; border-radius:1.5rem; }
        .illRing{
          position:absolute;
          inset:-10px;
          border-radius:26px;
          background: radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.32),
            rgba(12,42,92,.1),
            rgba(12,42,92,0)
          );
          animation: ringPulse 3.2s ease-in-out infinite;
          z-index:-1;
        }
        .illRing2{
          position:absolute;
          inset:-2px;
          border-radius:26px;
          border:1px solid rgba(12,42,92,.2);
          animation: ringPulse2 2.6s ease-in-out infinite;
          z-index:-1;
        }
        @keyframes ringPulse{
          0%{ opacity:.45; transform: scale(.98); }
          50%{ opacity:.85; transform: scale(1.03); }
          100%{ opacity:.45; transform: scale(.98); }
        }
        @keyframes ringPulse2{
          0%{ opacity:.25; }
          50%{ opacity:.55; }
          100%{ opacity:.25; }
        }
      `}</style>
    </>
  );
};

export default Landing;