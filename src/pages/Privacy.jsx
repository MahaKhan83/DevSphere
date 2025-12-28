import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Privacy() {
  const navigate = useNavigate();

  const TOC = useMemo(
    () => [
      { id: "intro", title: "1. Introduction" },
      { id: "collect", title: "2. Information We Collect" },
      { id: "use", title: "3. How We Use Your Information" },
      { id: "security", title: "4. Data Security" },
      { id: "cookies", title: "5. Cookies" },
      { id: "rights", title: "6. Your Rights" },
      { id: "changes", title: "7. Changes to This Policy" },
      { id: "contact", title: "8. Contact Us" },
    ],
    []
  );

  const [activeId, setActiveId] = useState("intro");
  const [clickedId, setClickedId] = useState(null);

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: [0.08, 0.12, 0.2, 0.35] }
    );

    sections.forEach((sec) => obs.observe(sec));
    return () => obs.disconnect();
  }, [TOC]);

  const handleTocClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 260);

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <div className="min-h-screen bg-[#eef3f7] relative overflow-hidden">
      {/* ✅ BACKGROUND (STATIC — no moving animations) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="bgBlob bgBlob1" />
        <div className="bgBlob bgBlob2" />
        <div className="bgBlob bgBlob3" />
        <div className="bgGridStatic" />
        <div className="bgGrainStatic" />
      </div>

      {/* ✅ HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur shadow-lg">
        <div className="w-full px-6 md:px-10 py-3 flex items-center justify-between relative">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevSphere"
              className="w-10 h-10 md:w-11 md:h-11 object-contain"
            />
            <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* ✅ NEAT Back button (no arrow) */}
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 rounded-full
                         bg-white/10 hover:bg-white/15
                         border border-white/20 hover:border-white/30
                         text-white text-sm font-medium
                         transition"
            >
              Back
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium shadow transition"
            >
              Log in
            </button>
          </div>

          {/* underline (static) */}
          <div className="navyGlowLineStatic" />
        </div>
      </header>

      {/* ✅ PAGE BODY */}
      <div className="pt-28 md:pt-32 px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* ✅ HERO (centered like screenshot) */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-700">
              How DevSphere handles your data
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* ✅ Two-column layout (content + sticky TOC) */}
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* LEFT: Main Card */}
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden">
              {/* ✅ Mobile TOC */}
              <div className="lg:hidden">
                <div className="tocBox rounded-2xl border border-slate-200 bg-white/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Table of Contents
                    </h2>
                    <span className="text-xs text-slate-500">Tap to jump</span>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    {TOC.map((item) => {
                      const isActive = activeId === item.id;
                      const isClicked = clickedId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTocClick(item.id)}
                          className={[
                            "w-full text-left rounded-xl px-4 py-3",
                            "border bg-white hover:bg-slate-50 transition",
                            isActive ? "border-sky-300 ring-2 ring-sky-200/60" : "border-slate-200",
                            isClicked ? "tocClicked" : "",
                          ].join(" ")}
                        >
                          <span className="text-slate-800 font-medium">
                            {item.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ✅ Content */}
              <div className="mt-8 space-y-7 text-slate-700 leading-relaxed">
                <section id="intro" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    1. Introduction
                  </h2>
                  <p>
                    Welcome to <strong>DevSphere</strong>. Your privacy matters to us.
                    This policy explains how we collect, use, and protect your information
                    when you use our developer collaboration and portfolio platform.
                  </p>
                </section>

                <section id="collect" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    2. Information We Collect
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name, email address, and account credentials</li>
                    <li>Profile details and portfolio content you add</li>
                    <li>Usage data (pages visited, actions performed)</li>
                  </ul>
                </section>

                <section id="use" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    3. How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and improve DevSphere services</li>
                    <li>To enable collaboration features and portfolio sharing</li>
                    <li>To send important updates and security notifications</li>
                  </ul>
                </section>

                <section id="security" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    4. Data Security
                  </h2>
                  <p>
                    We use reasonable security measures to protect your data. However,
                    no system can be guaranteed 100% secure.
                  </p>
                </section>

                <section id="cookies" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    5. Cookies
                  </h2>
                  <p>
                    DevSphere may use cookies to enhance user experience and improve
                    platform performance. You can disable cookies in your browser settings.
                  </p>
                </section>

                <section id="rights" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    6. Your Rights
                  </h2>
                  <p>
                    You can access, update, or delete your personal data. You can also
                    request account deletion via DevSphere support.
                  </p>
                </section>

                <section id="changes" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    7. Changes to This Policy
                  </h2>
                  <p>
                    We may update this policy occasionally. Changes will appear here with a
                    new revision date.
                  </p>
                </section>

                <section id="contact" className="scrollMT">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    8. Contact Us
                  </h2>
                  <p>Questions? Contact us through the DevSphere support page.</p>
                </section>
              </div>

              <div className="mt-10">
                {/* ✅ no arrow */}
                <Link
                  to="/"
                  className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* RIGHT: Sticky TOC (desktop) */}
            <aside className="hidden lg:block stickyTOC">
              <div className="tocBox rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Table of Contents
                  </h2>
                  <span className="text-sm text-slate-500">Jump</span>
                </div>

                <div className="mt-4 space-y-2">
                  {TOC.map((item) => {
                    const isActive = activeId === item.id;
                    const isClicked = clickedId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTocClick(item.id)}
                        className={[
                          "w-full text-left rounded-xl px-4 py-3",
                          "border bg-white hover:bg-slate-50 transition",
                          isActive ? "border-sky-300 ring-2 ring-sky-200/60" : "border-slate-200",
                          isClicked ? "tocClicked" : "",
                        ].join(" ")}
                      >
                        <span className="text-slate-800 font-medium">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Tip: Contents stays visible while you scroll.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ✅ CSS (STATIC) */}
      <style>{`
        .scrollMT { scroll-margin-top: 110px; }

        .stickyTOC{
          position: sticky;
          top: 118px;
          align-self: start;
          height: fit-content;
        }

        /* Small click feedback only */
        @keyframes tocTap {
          0% { transform: scale(1); }
          40% { transform: scale(0.985); }
          100% { transform: scale(1); }
        }
        .tocClicked{ animation: tocTap .26s ease-out; }

        .navyGlowLineStatic{
          position:absolute;
          left:0; right:0; bottom:-1px;
          height:2px;
          background: linear-gradient(90deg,
            rgba(12,42,92,0) 0%,
            rgba(12,42,92,0.75) 30%,
            rgba(56,189,248,0.55) 50%,
            rgba(12,42,92,0.75) 70%,
            rgba(12,42,92,0) 100%
          );
          opacity:.9;
        }

        .bgBlob{
          position:absolute;
          border-radius:999px;
          filter: blur(95px);
          opacity:.42;
          background: radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.85),
            rgba(6,22,58,.45),
            rgba(3,12,28,0)
          );
        }
        .bgBlob1{ left:-240px; top:-260px; width:720px; height:720px; }
        .bgBlob2{ right:-280px; bottom:-320px; width:780px; height:780px; opacity:.30; }
        .bgBlob3{ left:22%; bottom:-360px; width:720px; height:720px; opacity:.22; }

        .bgGridStatic{
          position:absolute;
          inset:0;
          opacity:.10;
          background-image:
            linear-gradient(to right, rgba(12,42,92,.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(12,42,92,.25) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .bgGrainStatic{
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