// src/pages/ContactSupport.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { createSupportTicket } from "../services/api";

export default function ContactSupport() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast.error("Please fill all fields");
      return;
    }

    setSaving(true);

    const res = await createSupportTicket(payload);

    if (res?.error) {
      toast.error(res.error || "Failed to submit support request");
      setSaving(false);
      return;
    }

    toast.success("Support request submitted successfully ✅");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setSaving(false);

    setTimeout(() => {
      navigate("/support");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#eef3f7] relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="staticBlob staticBlob1" />
        <div className="staticBlob staticBlob2" />
        <div className="staticBlob staticBlob3" />
        <div className="staticShimmer" />
        <div className="staticGrid" />
        <div className="staticGrain" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur shadow-lg">
        <div className="w-full px-6 md:px-10 py-3 flex items-center justify-between relative">
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

          <button
            onClick={() => navigate(-1)}
            className="h-10 px-4 rounded-full border border-white/20 text-white/90
                       hover:text-white hover:border-white/30 hover:bg-white/5
                       transition text-sm btnGlowSoft focusRing"
          >
            Back
          </button>

          <div className="navyGlowLineStatic" />
        </div>
      </header>

      {/* Body */}
      <div className="pt-32 px-6 pb-14">
        <div
          className={`max-w-4xl mx-auto ${mounted ? "pageIn" : "pageBefore"}`}
        >
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.35em] uppercase text-slate-500 fadeUp-1">
              Help Center
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 fadeUp-2">
              Contact Support
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto fadeUp-3">
              Submit your issue and our team will review it shortly.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 relative overflow-hidden fadeUp-4"
          >
            <div className="cardGlowStatic" />
            <div className="cardTopLine" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter your name"
                  className="inputField focusRing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="inputField focusRing"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="What is the issue about?"
                  className="inputField focusRing"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={7}
                  placeholder="Describe your issue in detail..."
                  className="inputField textAreaField focusRing"
                />
              </div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-slate-500">
                Please provide complete details for faster support.
              </p>

              <button
                type="submit"
                disabled={saving}
                className={`submitBtn focusRing ${saving ? "submitBtnDisabled" : ""}`}
              >
                {saving ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>

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

        .focusRing:focus{ outline:none; }
        .focusRing:focus-visible{
          box-shadow:
            0 0 0 3px rgba(56,189,248,.25),
            0 0 0 1px rgba(12,42,92,.15);
        }

        .inputField{
          width:100%;
          border:1px solid rgba(226,232,240,1);
          background: rgba(255,255,255,.85);
          color:#0f172a;
          border-radius:16px;
          padding: 12px 14px;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .inputField::placeholder{ color: #94a3b8; }
        .inputField:hover{ border-color: rgba(12,42,92,.22); }
        .inputField:focus{
          outline:none;
          border-color: rgba(12,42,92,.35);
          box-shadow:
            0 0 0 3px rgba(56,189,248,.12),
            0 8px 24px rgba(12,42,92,.08);
          background: rgba(255,255,255,.96);
        }

        .textAreaField{
          resize: vertical;
          min-height: 170px;
        }

        .submitBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 12px 18px;
          border-radius: 999px;
          background: rgba(12,42,92,.96);
          color:white;
          font-size:14px;
          font-weight:700;
          box-shadow: 0 12px 28px rgba(12,42,92,.18);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .submitBtn:hover{
          transform: translateY(-2px);
          box-shadow: 0 18px 35px rgba(12,42,92,.22);
        }
        .submitBtnDisabled{
          opacity:.7;
          cursor:not-allowed;
        }

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