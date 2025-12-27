import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#eef3f7] pt-28 px-6">
      <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow p-6">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-slate-700">
          Yahan tum apni DevSphere privacy policy likhogi (data usage, cookies, etc.).
        </p>

        <div className="mt-6">
          <Link className="text-sky-600 hover:underline" to="/">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}