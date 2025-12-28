// src/pages/Support.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Support() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // ✅ FAQ accordion
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const supportEmail = "support@devsphere.com";

  const cards = useMemo(
    () => [
      {
        title: "Email Support",
        desc: "Contact our support team for account, billing, or technical issues.",
        tag: supportEmail,
        onClick: () => {
          // opens default mail client
          window.location.href = `mailto:${supportEmail}`;
        },
        btn: "Email Now",
      },
      {
        title: "Documentation",
        desc: "Learn how to build portfolios, use collaboration rooms, and manage projects.",
        tag: "Guides • Tutorials",
        onClick: () => navigate("/docs"), // ✅ change route if you want
        btn: "Open Docs",
      },
      {
        title: "Community",
        desc: "Join the DevSphere community to ask questions and share ideas.",
        tag: "Ask • Share • Grow",
        onClick: () => navigate("/community"), // ✅ change route if you want
        btn: "Join",
      },
    ],
    [navigate]
  );

  const faqs = useMemo(
    () => [
      {
        q: "How do I build my portfolio?",
        a: "Go to the Dashboard and open Build Portfolio, then customize sections using drag and drop.",
      },
      {
        q: "How does real-time collaboration work?",
        a: "Collaboration rooms allow developers to code and chat together using live sessions powered by WebSockets.",
      },
      {
        q: "Can I showcase my projects publicly?",
        a: "Yes. Projects shared in the Showcase Feed are visible to other developers.",
      },
    ],
    []
  );

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

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="h-10 px-4 rounded-full
                       border border-white/20 text-white/90
                       hover:text-white hover:border-white/30 hover:bg-white/5
                       transition text-sm btnGlowSoft focusRing"
          >
            Back
          </button>

          {/* Static underline glow (no movement) */}
          <div className="navyGlowLineStatic" />
        </div>
      </header>

      {/* ================= PAGE BODY ================= */}
      <div className="pt-32 px-6 pb-14">
        <div
          className={`max-w-5xl mx-auto space-y-10 ${
            mounted ? "pageIn" : "pageBefore"
          }`}
        >
          {/* HERO */}
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500 fadeUp-1">
              Help Center
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 fadeUp-2">
              DevSphere Support
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto fadeUp-3">
              Need help using DevSphere? We’re here with guides, FAQs, and direct
              assistance.
            </p>
          </div>

          {/* SUPPORT OPTIONS (✅ FULL CLICKABLE CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fadeUp-4">
            {cards.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={c.onClick}
                className="infoCard clickableCard bg-white/90 backdrop-blur rounded-2xl border border-slate-200
                           shadow-sm p-6 relative overflow-hidden text-left
                           focusRing"
              >
                <div className="cardGlowStatic" />
                <div className="cardTopLine" />

                <h3 className="text-lg font-semibold text-slate-900 mb-2 relative">
                  {c.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 relative">{c.desc}</p>

                <div className="relative flex items-center justify-between gap-3 mt-auto">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {c.tag}
                  </span>

                  {/* button look (but whole card clickable) */}
                  <span className="miniBtn">
                    {c.btn}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* FAQ SECTION (✅ CLICKABLE ACCORDION) */}
          <div className="faqCard bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="cardGlowStatic" />
            <div className="cardTopLine" />

            <h2 className="text-xl font-semibold text-slate-900 mb-4 relative">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3 relative">
              {faqs.map((item, i) => {
                const active = openFaq === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpenFaq(active ? -1 : i)}
                    className={`qa qaBtn focusRing ${active ? "qaActive" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900 text-left">
                        {item.q}
                      </p>
                      <span
                        className={`chev ${active ? "chevOpen" : ""}`}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </div>

                    <div
                      className={`qaBody ${active ? "qaBodyOpen" : ""}`}
                      aria-hidden={!active}
                    >
                      <p className="text-slate-600 mt-2 text-left">{item.a}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTACT CTA (✅ CLICKABLE) */}
          <button
            type="button"
            onClick={() => navigate("/contact-support")} // ✅ change route if you want
            className="ctaCard ctaClickable bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white
                       flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden
                       focusRing"
          >
            <div className="ctaGlowStatic" />

            <div className="relative text-left">
              <h3 className="text-lg font-semibold">Still need help?</h3>
              <p className="text-sm text-slate-300 mt-1">
                Tap here to contact support — we’ll get back to you shortly.
              </p>
            </div>

            <span className="relative px-6 py-2 rounded-full bg-white text-slate-900 font-semibold miniBtnLight">
              Contact Support
            </span>
          </button>
        </div>
      </div>

      {/* ✅ STYLES (NAVI BLUE + CLICKABLE, NO MOVING BACKGROUND) */}
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
        .fadeUp-4{ animation: fadeUp 1.3s ease-out both; }

        @keyframes cardIn{
          0%{ opacity:0; transform: translateY(14px) scale(.99); }
          100%{ opacity:1; transform: translateY(0) scale(1); }
        }
        .infoCard, .faqCard, .ctaCard{ animation: cardIn .75s cubic-bezier(.2,.9,.2,1) both; }

        /* ✅ Focus ring */
        .focusRing:focus{ outline: none; }
        .focusRing:focus-visible{
          box-shadow:
            0 0 0 3px rgba(56,189,248,.25),
            0 0 0 1px rgba(12,42,92,.15);
        }

        /* ✅ Clickable cards */
        .clickableCard{
          cursor:pointer;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
        }
        .clickableCard:hover{
          transform: translateY(-6px);
          background: rgba(255,255,255,.95);
          border-color: rgba(12,42,92,.22);
          box-shadow:
            0 18px 50px rgba(12,42,92,.14),
            0 0 0 1px rgba(12,42,92,.08);
        }
        .clickableCard:active{ transform: translateY(-3px) scale(.99); }

        /* ✅ Navy top line highlight */
        .cardTopLine{
          position:absolute;
          left:16px; right:16px; top:10px;
          height:2px;
          background: linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(12,42,92,.45),
            rgba(56,189,248,.35),
            rgba(12,42,92,.45),
            rgba(12,42,92,0)
          );
          opacity:.75;
        }

        .faqCard{
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
        }
        .faqCard:hover{
          transform: translateY(-5px);
          background: rgba(255,255,255,.95);
          border-color: rgba(12,42,92,.22);
          box-shadow:
            0 18px 50px rgba(12,42,92,.14),
            0 0 0 1px rgba(12,42,92,.08);
        }

        /* ✅ FAQ buttons */
        .qaBtn{
          width:100%;
          border: 1px solid rgba(226,232,240,1);
          border-radius: 16px;
          padding: 14px 14px;
          background: rgba(255,255,255,.68);
          transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
          cursor:pointer;
          text-align:left;
        }
        .qaBtn:hover{
          border-color: rgba(12,42,92,.22);
          box-shadow: 0 12px 30px rgba(12,42,92,.10);
          transform: translateY(-2px);
        }
        .qaActive{
          border-color: rgba(12,42,92,.35);
          box-shadow:
            0 16px 36px rgba(12,42,92,.12),
            0 0 0 1px rgba(56,189,248,.12);
        }

        .qaBody{ max-height:0; overflow:hidden; transition: max-height .25s ease; }
        .qaBodyOpen{ max-height:140px; }

        .chev{
          width:28px; height:28px;
          display:grid; place-items:center;
          border-radius: 10px;
          background: rgba(15,23,42,.06);
          border: 1px solid rgba(15,23,42,.08);
          transition: transform .2s ease, background .2s ease, border-color .2s ease;
          color: rgba(15,23,42,.75);
          flex: 0 0 auto;
        }
        .qaActive .chev{
          background: rgba(56,189,248,.12);
          border-color: rgba(12,42,92,.20);
        }
        .chevOpen{ transform: rotate(180deg); }

        /* ✅ CTA clickable */
        .ctaClickable{
          cursor:pointer;
          transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
        }
        .ctaClickable:hover{
          transform: translateY(-4px);
          box-shadow:
            0 18px 55px rgba(12,42,92,.22),
            0 0 0 1px rgba(56,189,248,.10);
        }
        .ctaClickable:active{ transform: translateY(-2px) scale(.99); }

        .miniBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(12,42,92,.9);
          color: white;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 10px 22px rgba(12,42,92,.18);
        }
        .miniBtnLight{
          box-shadow: 0 12px 28px rgba(0,0,0,.18);
        }

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

        /* CTA static highlight */
        .ctaGlowStatic{
          position:absolute;
          inset:-2px;
          background: radial-gradient(circle at 20% 0%,
            rgba(56,189,248,.18),
            rgba(12,42,92,0) 55%
          );
          opacity:.55;
          pointer-events:none;
        }
      `}</style>
    </div>
  );
}