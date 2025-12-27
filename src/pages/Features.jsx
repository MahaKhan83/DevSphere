// src/pages/Features.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Features() {
  const navigate = useNavigate();

  /* ------------------ Icons ------------------ */
  const IconWrap = ({ children }) => (
    <span
      className="iconWrap inline-flex items-center justify-center w-12 h-12 rounded-2xl
                 bg-sky-100 text-sky-700 border border-sky-200 transition"
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
    },
    {
      title: "Portfolio Builder",
      desc: "Drag & drop sections to create professional developer portfolios.",
      icon: <PortfolioIcon />,
      to: "/portfolio",
    },
    {
      title: "Showcase Feed",
      desc: "Publish projects, receive feedback and grow your developer presence.",
      icon: <FeedIcon />,
      to: "/showcase",
    },
    {
      title: "Smart Notifications",
      desc: "Instant alerts for invites, comments and collaboration activity.",
      icon: <BellIcon />,
      to: "/notifications",
    },
  ];

  return (
    <>
      {/* HEADER (same as Landing) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur
                         flex items-center justify-between px-6 md:px-10 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logo} alt="DevSphere"
               className="w-14 h-14 md:w-16 md:h-16 object-contain
                          transition-transform duration-500 hover:scale-110 hover:rotate-1" />
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Dev<span className="text-cyan-300">Sphere</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400
                     text-sm md:text-base font-medium shadow-md
                     transition-all hover:-translate-y-[2px] navyBtnGlow"
        >
          Log in
        </button>

        <div className="navyGlowLine" />
      </header>

      {/* BACKGROUND FX */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="sfBlob sfBlob1" />
        <div className="sfBlob sfBlob2" />
        <div className="sfBlob sfBlob3" />
        <div className="sfShimmer" />
      </div>

      {/* MAIN */}
      <div className="min-h-screen bg-[#eef3f7] pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto fadeInUp">
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500">
              Platform Capabilities
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-slate-900">
              Everything you need to
              <span className="block text-sky-600">build, collaborate & grow</span>
            </h1>
            <p className="mt-4 text-slate-600">
              DevSphere combines collaboration, portfolios and community.
            </p>
          </div>

          {/* FEATURE BOXES */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="featureCard bg-white rounded-3xl border border-slate-200 p-6
                           shadow-sm transition-all"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <IconWrap>{f.icon}</IconWrap>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>

                {/* ✅ CLEAN BUTTON (no arrow) */}
                <button
                  onClick={() => navigate(f.to)}
                  className="mt-5 inline-flex items-center justify-center
                             px-5 py-2 rounded-full text-sm font-semibold
                             bg-slate-900 text-white
                             hover:bg-slate-800 transition navyBtnGlowSoft"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER (same as Landing) */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 mt-14">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="footer-wrap">
            <Link to="/" className="footer-linkBlock">
              <p className="footer-tagline">
                Developer Collaboration & Portfolio Platform
              </p>
            </Link>
            <p className="footer-copy">
              © {new Date().getFullYear()} DevSphere
            </p>
          </div>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        /* ---- Notification-like entrance ---- */
        .fadeInUp{
          animation: notifIn .7s ease-out forwards;
        }
        .featureCard{
          opacity:0;
          transform: translateY(18px);
          animation: notifIn .7s ease-out forwards;
        }
        @keyframes notifIn{
          to{ opacity:1; transform: translateY(0); }
        }

        /* ---- Hover navy glow (same feel as Notifications) ---- */
        .featureCard:hover{
          transform: translateY(-6px);
          box-shadow:
            0 18px 40px rgba(12,42,92,.18),
            0 0 0 1px rgba(12,42,92,.08);
        }
        .featureCard:hover .iconWrap{
          background:#0c2a5c;
          color:#e0f2fe;
          box-shadow:0 0 0 6px rgba(12,42,92,.12);
        }

        /* ---- Glow line ---- */
        .navyGlowLine{
          position:absolute;left:0;right:0;bottom:-1px;height:2px;
          background:linear-gradient(90deg,
            rgba(12,42,92,0),
            rgba(12,42,92,.85),
            rgba(56,189,248,.65),
            rgba(12,42,92,.85),
            rgba(12,42,92,0)
          );
          animation: glowSweep 3.6s ease-in-out infinite;
        }
        @keyframes glowSweep{
          0%{opacity:.25;transform:translateX(-18%)}
          50%{opacity:.9;transform:translateX(18%)}
          100%{opacity:.25;transform:translateX(-18%)}
        }
      `}</style>
    </>
  );
}