import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef3f7] relative overflow-hidden">
      {/* ✅ BACKGROUND FX (same navy blue animations) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="sfBlob sfBlob1" />
        <div className="sfBlob sfBlob2" />
        <div className="sfBlob sfBlob3" />
        <div className="pageShimmer" />
        <div className="pageGrid" />
        <div className="sfGrain" />
      </div>

      {/* HEADER (recommended) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur shadow-lg">
        <div className="w-full px-6 md:px-10 py-3 flex items-center justify-between relative">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevSphere"
              className="w-10 h-10 md:w-11 md:h-11 object-contain transition-transform duration-500 hover:scale-110 hover:rotate-1"
            />
            <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full border border-white/20 text-white/90 hover:text-white hover:border-white/30 transition text-sm navyBtnGlowSoft"
            >
              ← Back
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium shadow transition navyBtnGlow"
            >
              Log in
            </button>
          </div>

          {/* underline glow */}
          <div className="navyGlowLine" />
        </div>
      </header>

      {/* PAGE BODY */}
      <div className="pt-28 md:pt-32 px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Card (animated like notification theme) */}
          <div className="policyCard bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden">
            {/* shimmer on card */}
            <div className="cardShimmer" />

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 fadeUp-1">
              Privacy Policy
            </h1>
            <p className="mt-3 text-slate-600 text-sm md:text-base fadeUp-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            {/* Content */}
            <div className="mt-8 space-y-7 text-slate-700 leading-relaxed fadeUp-3">
              <section className="sectionPop">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  1. Introduction
                </h2>
                <p>
                  Welcome to <strong>DevSphere</strong>. Your privacy matters to
                  us. This policy explains how we collect, use, and protect your
                  information when you use our developer collaboration and
                  portfolio platform.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "80ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  2. Information We Collect
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and account credentials</li>
                  <li>Profile details and portfolio content you add</li>
                  <li>Usage data (pages visited, actions performed)</li>
                </ul>
              </section>

              <section className="sectionPop" style={{ animationDelay: "160ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and improve DevSphere services</li>
                  <li>To enable collaboration features and portfolio sharing</li>
                  <li>To send important updates and security notifications</li>
                </ul>
              </section>

              <section className="sectionPop" style={{ animationDelay: "240ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  4. Data Security
                </h2>
                <p>
                  We use reasonable security measures to protect your data.
                  However, no system can be guaranteed 100% secure.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "320ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  5. Cookies
                </h2>
                <p>
                  DevSphere may use cookies to enhance user experience and
                  improve platform performance. You can disable cookies in your
                  browser settings.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "400ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  6. Your Rights
                </h2>
                <p>
                  You can access, update, or delete your personal data. You can
                  also request account deletion via DevSphere support.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "480ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  7. Changes to This Policy
                </h2>
                <p>
                  We may update this policy occasionally. Changes will appear
                  here with a new revision date.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "560ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  8. Contact Us
                </h2>
                <p>Questions? Contact us through the DevSphere support page.</p>
              </section>
            </div>

            {/* Bottom link */}
            <div className="mt-10 fadeUp-4 relative">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition navyLink"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CSS (same navy blue background + card animations) */}
      <style>{`
        /* ---------- Entry (like your landing/features) ---------- */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fadeUp-1 { animation: fadeUp .8s ease-out forwards; }
        .fadeUp-2 { animation: fadeUp 1s ease-out forwards; }
        .fadeUp-3 { animation: fadeUp 1.2s ease-out forwards; }
        .fadeUp-4 { animation: fadeUp 1.4s ease-out forwards; }

        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(16px) scale(.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .policyCard{
          animation: cardIn .75s cubic-bezier(.2,.9,.2,1) forwards;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .policyCard:hover{
          transform: translateY(-6px);
          box-shadow:
            0 18px 45px rgba(12,42,92,.16),
            0 0 0 1px rgba(12,42,92,.08);
        }

        /* sections pop (subtle) */
        @keyframes softPop {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .sectionPop{
          opacity: 0;
          animation: softPop .65s ease-out forwards;
        }
        .fadeUp-3 .sectionPop{ opacity: 1; } /* in case browser optimizes */
        .sectionPop{ animation-delay: 40ms; }
        .sectionPop:nth-child(2){ animation-delay: 120ms; }
        .sectionPop:nth-child(3){ animation-delay: 200ms; }
        .sectionPop:nth-child(4){ animation-delay: 280ms; }
        .sectionPop:nth-child(5){ animation-delay: 360ms; }
        .sectionPop:nth-child(6){ animation-delay: 440ms; }
        .sectionPop:nth-child(7){ animation-delay: 520ms; }
        .sectionPop:nth-child(8){ animation-delay: 600ms; }

        /* ---------- Card shimmer (navy) ---------- */
        .cardShimmer{
          position:absolute;
          inset:-2px;
          background:linear-gradient(120deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,.14) 38%,
            rgba(56,189,248,.10) 50%,
            rgba(12,42,92,0) 72%
          );
          transform:translateX(-60%) skewX(-10deg);
          opacity:.45;
          pointer-events:none;
          animation: shimmerSweep 6.2s ease-in-out infinite;
          mix-blend-mode: multiply;
        }
        @keyframes shimmerSweep{
          0%{ transform:translateX(-70%) skewX(-10deg); }
          50%{ transform:translateX(55%) skewX(-10deg); }
          100%{ transform:translateX(-70%) skewX(-10deg); }
        }

        /* ---------- Header underline glow ---------- */
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

        /* ---------- Buttons glow (same vibe) ---------- */
        .navyBtnGlow, .navyBtnGlowSoft{ position:relative; overflow:hidden; }
        .navyBtnGlow::after{
          content:"";
          position:absolute; inset:-2px;
          background:linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(56,189,248,.22),
            rgba(12,42,92,0)
          );
          transform:translateX(-70%);
          animation: btnSheen 3.8s ease-in-out infinite;
          pointer-events:none;
        }
        .navyBtnGlowSoft::after{
          content:"";
          position:absolute; inset:-2px;
          background:linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(12,42,92,.22),
            rgba(12,42,92,0)
          );
          transform:translateX(-70%);
          animation: btnSheen 4.4s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes btnSheen{
          0%{ transform:translateX(-70%); }
          50%{ transform:translateX(70%); }
          100%{ transform:translateX(-70%); }
        }

        .navyLink{ position:relative; }
        .navyLink::after{
          content:"";
          position:absolute;
          left:0; bottom:-6px;
          width:100%; height:2px;
          background:linear-gradient(90deg, rgba(12,42,92,0), rgba(56,189,248,.65), rgba(12,42,92,0));
          opacity:.0;
          transition:opacity .25s ease;
        }
        .navyLink:hover::after{ opacity:.9; }

        /* ---------- PAGE BACKGROUND (navy animated) ---------- */
        .sfBlob{
          position:absolute;
          border-radius:999px;
          filter: blur(95px);
          opacity:.50;
          background: radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.9),
            rgba(6,22,58,.55),
            rgba(3,12,28,0)
          );
          animation: sfFloat 14s ease-in-out infinite;
        }
        .sfBlob1{ left:-240px; top:-260px; width:720px; height:720px; }
        .sfBlob2{ right:-280px; bottom:-320px; width:780px; height:780px; opacity:.42; animation-duration:18s; }
        .sfBlob3{ left:22%; bottom:-360px; width:720px; height:720px; opacity:.28; animation-duration:22s; }
        @keyframes sfFloat{
          0%{ transform:translate(0,0) scale(1); }
          50%{ transform:translate(50px,-35px) scale(1.08); }
          100%{ transform:translate(0,0) scale(1); }
        }

        .pageShimmer{
          position:absolute;
          inset:-40px;
          background:linear-gradient(120deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,.18) 40%,
            rgba(56,189,248,.10) 52%,
            rgba(12,42,92,0) 74%
          );
          transform: translateX(-60%) skewX(-10deg);
          opacity:.55;
          animation: pageSweep 6.2s ease-in-out infinite;
          mix-blend-mode: multiply;
        }
        @keyframes pageSweep{
          0%{ transform:translateX(-70%) skewX(-10deg); }
          50%{ transform:translateX(60%) skewX(-10deg); }
          100%{ transform:translateX(-70%) skewX(-10deg); }
        }

        .pageGrid{
          position:absolute;
          inset:0;
          opacity:.10;
          background-image:
            linear-gradient(to right, rgba(12,42,92,.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(12,42,92,.25) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: gridMove 18s linear infinite;
        }
        @keyframes gridMove{
          0%{ transform: translate3d(0,0,0); }
          100%{ transform: translate3d(64px,64px,0); }
        }

        .sfGrain{
          position:absolute;
          inset:0;
          opacity:.10;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
          pointer-events:none;
        }
      `}</style>
    </div>
  );
}