// src/pages/Portfolio.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

const initialSections = [
  {
    id: "about",
    title: "About",
    description: "Tell the world who you are, what you do, and what you love building.",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Highlight your best work with links, tech stack, and what you shipped.",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Show the tools, languages, and frameworks you’re strongest in.",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Add quotes from teammates, clients, or mentors.",
  },
];

const Portfolio = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [sections, setSections] = useState(initialSections);
  const [activeSectionId, setActiveSectionId] = useState("about");

  // editable content for each section
  const [content, setContent] = useState({
    about: "I’m a passionate developer who loves building modern web experiences.",
    projects: "- DevSphere: Developer collaboration & portfolio platform\n- SmartTaxPro: Tax filing assistant\n- Realtime Board: Live collaboration dashboard",
    skills: "React · Node.js · Express · MongoDB · Tailwind CSS · Socket.IO",
    testimonials:
      '“Working with this developer was a game-changer for our team.” — Project Lead',
  });

  const displayName = user?.name || user?.email || "DevSphere user";

  // ----- drag & drop handlers -----
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // required so onDrop fires
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    const updated = [...sections];
    const fromIndex = updated.findIndex((s) => s.id === draggedId);
    const toIndex = updated.findIndex((s) => s.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSections(updated);
  };

  const handleContentChange = (id, value) => {
    setContent((prev) => ({ ...prev, [id]: value }));
  };

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* FIXED HEADER (same vibe as login/landing) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur flex items-center justify-between px-6 md:px-10 py-3 shadow-lg">
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

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-slate-200">
            Building portfolio for{" "}
            <span className="font-semibold text-white">{displayName}</span>
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-full bg-slate-800 text-slate-100 text-sm font-medium hover:bg-slate-700 transition"
          >
            Back to dashboard
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-10 pt-28 pb-8">
        {/* LEFT: Drag & drop list + editor */}
        <section className="w-full md:w-5/12 lg:w-4/12">
          <h2 className="text-sm tracking-[0.35em] uppercase text-slate-500 mb-2">
            Portfolio builder
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
            Arrange your sections
          </h3>

          {/* Draggable list */}
          <div className="space-y-2 mb-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border cursor-move bg-white shadow-sm transition-all ${
                  activeSectionId === section.id
                    ? "border-sky-400 bg-sky-50"
                    : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
                onClick={() => setActiveSectionId(section.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-lg">⠿</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {section.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                  Drag
                </span>
              </div>
            ))}
          </div>

          {/* Editor for active section */}
          {activeSection && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4">
              <p className="text-xs font-semibold text-sky-600 uppercase mb-1">
                Editing: {activeSection.title}
              </p>
              <textarea
                className="w-full h-32 md:h-40 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={content[activeSection.id] || ""}
                onChange={(e) =>
                  handleContentChange(activeSection.id, e.target.value)
                }
                placeholder={`Write content for ${activeSection.title}...`}
              />
              <p className="mt-2 text-[11px] text-slate-500">
                Changes appear instantly in the preview on the right.
              </p>
            </div>
          )}
        </section>

        {/* RIGHT: Live preview */}
        <section className="w-full md:w-7/12 lg:w-8/12">
          <h2 className="text-sm tracking-[0.25em] uppercase text-slate-500 mb-2">
            Live preview
          </h2>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 relative overflow-hidden">
            {/* soft gradient accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-sky-200/50 blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {displayName}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Developer · DevSphere member
              </p>

              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      {section.title}
                    </h4>
                    <p className="text-sm whitespace-pre-line text-slate-700">
                      {content[section.id] || "No content yet."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Later we can add: **save to MongoDB**, publish as a public profile,
            and export as a PDF resume.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Portfolio;