// src/pages/Features.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Features() {
  const navigate = useNavigate();

  /* ------------------ Icons ------------------ */
  const IconWrap = ({ children }) => (
    <span
      className="inline-flex items-center justify-center w-11 h-11 rounded-2xl
                 bg-sky-100 text-sky-700 border border-sky-200 shadow-sm
                 iconPulse"
    >
      {children}
    </span>
  );

  const RoomsIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.67 0-8 1.34-8 4v1h10v-1c0-.9.3-1.7.8-2.4C9.9 13.5 8.7 13 8 13Zm8 0c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4Z" />
    </svg>
  );

  const PortfolioIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4h4a2 2 0 0 1 2 2v1h4v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7h4V6a2 2 0 0 1 2-2Zm0 3h4V6h-4v1Zm-3 6h10v2H7v-2Zm0 4h10v2H7v-2Z" />
    </svg>
  );

  const FeedIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm4 3h8v2H8V8Zm0 4h12v2H8v-2Zm0 4h10v2H8v-2Z" />
    </svg>
  );

  const BellIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm7-6V11a7 7 0 0 0-5-6.71V3a2 2 0 1 0-4 0v1.29A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" />
    </svg>
  );

  const features = [
    {
      title: "Collaboration Rooms",
      desc: "Real-time rooms with chat, shared code editors and team discussions.",
      icon: <RoomsIcon />,
      to: "/collaboration",
      tag: "Real-time",
    },
    {
      title: "Portfolio Builder",
      desc: "Drag & drop sections to create professional developer portfolios.",
      icon: <PortfolioIcon />,
      to: "/portfolio",
      tag: "Drag & Drop",
    },
    {
      title: "Showcase Feed",
      desc: "Publish projects, receive feedback and grow your developer presence.",
      icon: <FeedIcon />,
      to: "/showcase",
      tag: "Community",
    },
    {
      title: "Smart Notifications",
      desc: "Instant alerts for invites, comments and collaboration activity.",
      icon: <BellIcon />,
      to: "/notifications",
      tag: "Instant",
    },
  ];

  return (
    <>
      {/* ✅ HEADER — SAME AS LANDING */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="DevSphere"
            className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-500 hover:scale-110 hover:rotate-1"
          />
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Dev<span className="text-cyan-300">Sphere</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-sm md:text-base font-medium shadow-md transition-all duration-300 hover:-translate-y-[2px] active:translate-y-[1px] navyBtnGlow"
        >
          Log in
        </button>

        <div className="navyGlowLine" />
      </header>

      {/* ✅ BACKGROUND FX (NOW ALSO ANIMATED LIKE CARDS) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* blobs */}
        <div className="sfBlob sfBlob1" />
        <div className="sfBlob sfBlob2" />
        <div className="sfBlob sfBlob3" />

        {/* shimmer sweep (same motion as cards) */}
        <div className="pageShimmer" />

        {/* soft moving grid */}
        <div className="pageGrid" />

        {/* grain */}
        <div className="sfGrain" />
      </div>

      {/* MAIN */}
      <div className="min-h-screen bg-[#eef3f7] pt-32 px-6 pb-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto fadeUp-1">
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500">
              Platform Capabilities
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-slate-900 fadeUp-2">
              Everything you need to
              <span className="block text-sky-600">build, collaborate & grow</span>
            </h1>
            <p className="mt-4 text-slate-600 fadeUp-3">
              DevSphere combines collaboration, portfolios and community in one place.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="featureCard group bg-white/90 backdrop-blur rounded-2xl border border-slate-200
                           px-5 py-5 shadow-sm relative overflow-hidden"
                style={{ animationDelay: `${120 + i * 110}ms` }}
              >
                {/* shimmer sweep (navy) */}
                <div className="cardShimmer" />

                {/* subtle hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300
                             bg-gradient-to-br from-[rgba(12,42,92,0.14)] via-transparent to-transparent"
                />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3">
                    <IconWrap>{f.icon}</IconWrap>

                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[15px] md:text-[16px] font-semibold text-slate-900">
                    {f.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    {f.desc}
                  </p>

                  {/* Explore button */}
                  <div className="mt-5">
                    <button
                      onClick={() => navigate(f.to)}
                      className="exploreBtn w-full px-4 py-2 rounded-xl
                                 bg-slate-900 text-white text-sm font-semibold
                                 hover:bg-slate-800 transition
                                 shadow-sm active:scale-[0.98]"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ FOOTER — SAME AS LANDING */}
      <footer className="w-full bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="footer-wrap">
            <Link to="/" className="footer-linkBlock">
              <p className="footer-tagline">Developer Collaboration & Portfolio Platform</p>
            </Link>

            <Link to="/" className="footer-linkBlock">
              <p className="footer-copy">© {new Date().getFullYear()} DevSphere</p>
            </Link>

            <div className="footer-links">
              <Link to="/privacy" className="footer-link">Privacy</Link>
              <span className="footer-sep">|</span>
              <Link to="/terms" className="footer-link">Terms</Link>
              <span className="footer-sep">|</span>
              <Link to="/support" className="footer-link footer-link-accent">Support</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ STYLES (Cards + Page Background Animations in Navy Blue) */}
      <style>{`
        /* ---------- Entry ---------- */
        @keyframes fadeUp{
          0%{opacity:0;transform:translateY(25px)}
          100%{opacity:1;transform:translateY(0)}
        }
        .fadeUp-1{animation:fadeUp .8s ease-out forwards}
        .fadeUp-2{animation:fadeUp 1s ease-out forwards}
        .fadeUp-3{animation:fadeUp 1.2s ease-out forwards}

        @keyframes cardIn{
          0%{opacity:0;transform:translateY(18px) scale(.985)}
          100%{opacity:1;transform:translateY(0) scale(1)}
        }
        .featureCard{
          opacity:0;
          animation:cardIn .75s cubic-bezier(.2,.9,.2,1) forwards;
          transition: transform .25s ease, box-shadow .25s ease;
        }

        /* ---------- Hover ---------- */
        .featureCard:hover{
          transform: translateY(-7px);
          box-shadow:
            0 18px 45px rgba(12,42,92,.18),
            0 0 0 1px rgba(12,42,92,.10);
        }

        /* ---------- Card shimmer ---------- */
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
          opacity:.0;
          transition:opacity .25s ease;
          pointer-events:none;
          animation: shimmerSweep 5.8s ease-in-out infinite;
        }
        .featureCard:hover .cardShimmer{ opacity:.95; }

        @keyframes shimmerSweep{
          0%{ transform:translateX(-70%) skewX(-10deg); }
          50%{ transform:translateX(55%) skewX(-10deg); }
          100%{ transform:translateX(-70%) skewX(-10deg); }
        }

        /* ---------- Icon pulse ---------- */
        @keyframes iconPulse{
          0%,100%{ box-shadow: 0 0 0 0 rgba(12,42,92,.0); }
          50%{ box-shadow: 0 0 0 10px rgba(12,42,92,.10); }
        }
        .featureCard:hover .iconPulse{
          background:#0c2a5c;
          color:#e0f2fe;
          border-color: rgba(12,42,92,.18);
          animation: iconPulse 1.8s ease-in-out infinite;
        }

        /* ---------- Explore button sheen ---------- */
        .exploreBtn{ position:relative; overflow:hidden; }
        .exploreBtn::after{
          content:"";
          position:absolute;
          inset:-2px;
          background:linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(56,189,248,.18),
            rgba(12,42,92,0)
          );
          transform:translateX(-70%);
          opacity:.85;
          animation: btnSheen 3.6s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes btnSheen{
          0%{ transform:translateX(-70%); }
          50%{ transform:translateX(70%); }
          100%{ transform:translateX(-70%); }
        }

        /* ---------- HEADER line ---------- */
        .navyGlowLine{
          position:absolute;left:0;right:0;bottom:-1px;height:2px;
          background:linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(12,42,92,.85),
            rgba(56,189,248,.65),
            rgba(12,42,92,.85),
            rgba(12,42,92,0)
          );
          animation:glowSweep 3.6s ease-in-out infinite;
        }
        @keyframes glowSweep{
          0%{opacity:.25;transform:translateX(-18%)}
          50%{opacity:.9;transform:translateX(18%)}
          100%{opacity:.25;transform:translateX(-18%)}
        }

        /* ---------- PAGE BACKGROUND ANIMATIONS (same style as cards) ---------- */
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

        /* page shimmer sweep (same motion as cardShimmer) */
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

        /* soft animated grid (very light) */
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

        /* grain */
        .sfGrain{
          position:absolute;
          inset:0;
          opacity:.10;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
          pointer-events:none;
        }

        /* ---------- Footer ---------- */
        .footer-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}
        .footer-tagline{color:rgba(226,232,240,0.85);font-size:13px}
        .footer-copy{color:rgba(148,163,184,0.9);font-size:12px}
        .footer-links{display:flex;gap:10px}
        .footer-link{color:rgba(148,163,184,0.95);font-size:13px;text-decoration:none;transition:color .3s ease}
        .footer-link:hover{color:#fff}
        .footer-link-accent{color:rgba(34,211,238,0.95)}
        .footer-sep{color:rgba(71,85,105,1);font-size:12px}
      `}</style>
    </>
  );
}