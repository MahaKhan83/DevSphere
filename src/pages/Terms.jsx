// src/pages/Terms.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Terms() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#eef3f7] relative overflow-hidden">
      {/* ✅ STATIC BACKGROUND (NO MOVEMENT) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="staticBlob staticBlob1" />
        <div className="staticBlob staticBlob2" />
        <div className="staticBlob staticBlob3" />
        <div className="staticShimmer" />
        <div className="staticGrid" />
        <div className="staticGrain" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur shadow-lg">
        <div className="w-full px-6 md:px-10 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevSphere"
              className="w-10 h-10 object-contain transition-transform duration-500 hover:scale-110 hover:rotate-1"
            />
            <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </Link>

          {/* Back Button (Neat) */}
          <button
            onClick={() => navigate(-1)}
            className="h-10 px-4 rounded-full
                       border border-white/20 text-white/90
                       hover:text-white hover:border-white/30 hover:bg-white/5
                       transition text-sm btnGlowSoft"
          >
            Back
          </button>

          {/* Static underline glow (no movement) */}
          <div className="navyGlowLineStatic" />
        </div>
      </header>

      {/* ================= PAGE BODY ================= */}
      <div className="pt-32 px-6 pb-14">
        <div className={`max-w-6xl mx-auto ${mounted ? "pageIn" : "pageBefore"}`}>
          {/* ===== HERO (Heading outside box) ===== */}
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500 fadeUp-1">
              Legal
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-slate-900 fadeUp-2">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-slate-600 text-base md:text-lg fadeUp-3">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* ===== CONTENT CARD ===== */}
          <div className="max-w-4xl mx-auto termsCard bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden">
            {/* static inner highlight */}
            <div className="cardGlowStatic" />

            <div className="space-y-6 text-slate-700 leading-relaxed">
              <section className="sectionPop">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using <strong>DevSphere</strong>, you agree to
                  be bound by these Terms & Conditions. If you do not agree,
                  please do not use the platform.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "60ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  2. Platform Usage
                </h2>
                <p>
                  DevSphere is intended for developers to create portfolios,
                  collaborate on projects, and showcase work. You agree to use
                  the platform only for lawful and professional purposes.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "120ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  3. User Accounts
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining account security</li>
                  <li>You must provide accurate and up-to-date information</li>
                  <li>You may not impersonate another user</li>
                </ul>
              </section>

              <section className="sectionPop" style={{ animationDelay: "180ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  4. Content Ownership
                </h2>
                <p>
                  You retain ownership of your portfolio content, code snippets,
                  and projects. By posting content, you grant DevSphere
                  permission to display it on the platform.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "240ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  5. Collaboration & Conduct
                </h2>
                <p>
                  Users must maintain respectful communication in collaboration
                  rooms. Harassment, abuse, or misuse of collaboration tools is
                  strictly prohibited.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "300ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  6. Account Termination
                </h2>
                <p>
                  DevSphere reserves the right to suspend or terminate accounts
                  that violate these terms or misuse the platform.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "360ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  7. Limitation of Liability
                </h2>
                <p>
                  DevSphere is provided “as is”. We are not liable for data loss,
                  service interruptions, or third-party integrations.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "420ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  8. Changes to Terms
                </h2>
                <p>
                  We may update these Terms & Conditions at any time. Continued
                  use of DevSphere indicates acceptance of updated terms.
                </p>
              </section>

              <section className="sectionPop" style={{ animationDelay: "480ms" }}>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  9. Contact Information
                </h2>
                <p>
                  For questions regarding these terms, please contact DevSphere
                  support.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ STYLES (NO MOVING ANIMATIONS) */}
      <style>{`
        .pageBefore{ opacity:0; transform: translateY(10px); }
        .pageIn{ opacity:1; transform: translateY(0); transition: opacity .35s ease, transform .35s ease; }

        @keyframes fadeUp{
          0%{opacity:0; transform: translateY(20px)}
          100%{opacity:1; transform: translateY(0)}
        }
        .fadeUp-1{ animation: fadeUp .7s ease-out both; }
        .fadeUp-2{ animation: fadeUp .9s ease-out both; }
        .fadeUp-3{ animation: fadeUp 1.1s ease-out both; }

        @keyframes cardIn{
          0%{ opacity:0; transform: translateY(14px) scale(.99); }
          100%{ opacity:1; transform: translateY(0) scale(1); }
        }
        .termsCard{
          animation: cardIn .75s cubic-bezier(.2,.9,.2,1) both;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .termsCard:hover{
          transform: translateY(-6px);
          background: rgba(255,255,255,.94);
          box-shadow:
            0 22px 60px rgba(12,42,92,.16),
            0 0 0 1px rgba(12,42,92,.08);
        }

        @keyframes softPop{
          0%{ opacity:0; transform: translateY(10px); }
          100%{ opacity:1; transform: translateY(0); }
        }
        .sectionPop{ opacity:0; animation: softPop .6s ease-out both; }

        /* ✅ Static underline glow */
        .navyGlowLineStatic{
          position:absolute; left:0; right:0; bottom:-1px;
          height:2px;
          background: linear-gradient(90deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,0.85) 30%,
            rgba(56,189,248,0.65) 50%,
            rgba(12,42,92,0.85) 70%,
            rgba(12,42,92,0) 100%
          );
          opacity:.9;
        }

        /* ✅ Button subtle glow (NO movement) */
        .btnGlowSoft{ position:relative; overflow:hidden; }
        .btnGlowSoft::after{
          content:"";
          position:absolute; inset:-2px;
          background: radial-gradient(circle at 30% 50%,
            rgba(56,189,248,.16),
            rgba(12,42,92,0) 60%
          );
          opacity:.9;
          pointer-events:none;
        }

        /* ✅ Static background (NO movement) */
        .staticBlob{
          position:absolute;
          border-radius:999px;
          filter: blur(95px);
          opacity:.42;
          background: radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.85),
            rgba(6,22,58,.55),
            rgba(3,12,28,0)
          );
        }
        .staticBlob1{ left:-240px; top:-260px; width:720px; height:720px; }
        .staticBlob2{ right:-280px; bottom:-320px; width:780px; height:780px; opacity:.35; }
        .staticBlob3{ left:18%; bottom:-360px; width:720px; height:720px; opacity:.22; }

        .staticShimmer{
          position:absolute;
          inset:-10px;
          background: linear-gradient(120deg,
            rgba(3,12,28,0) 0%,
            rgba(12,42,92,.16) 42%,
            rgba(56,189,248,.12) 52%,
            rgba(3,12,28,0) 72%
          );
          opacity:.6;
          transform: skewX(-10deg);
          mix-blend-mode: multiply;
          pointer-events:none;
        }

        .staticGrid{
          position:absolute; inset:0;
          opacity:.10;
          background-image:
            linear-gradient(to right, rgba(12,42,92,.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(12,42,92,.22) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(circle at 28% 14%, black 0%, transparent 60%);
          pointer-events:none;
        }

        .staticGrain{
          position:absolute; inset:0;
          opacity:.10;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
          pointer-events:none;
        }

        /* Card inner static highlight */
        .cardGlowStatic{
          position:absolute;
          inset:-2px;
          background: radial-gradient(circle at 20% 0%,
            rgba(56,189,248,.14),
            rgba(12,42,92,0) 55%
          );
          opacity:.6;
          pointer-events:none;
        }
      `}</style>
    </div>
  );
}