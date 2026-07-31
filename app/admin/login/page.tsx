"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const next = searchParams.get("next") || "/admin";
        router.push(next);
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-deep/5 rounded-2xl flex items-center justify-center mx-auto text-teal-deep">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-xl font-black text-teal-deep">Admin Access</h1>
          <p className="text-xs text-slate-500">Enter the admin password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            autoFocus
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-deep/40"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <span>Log In</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
