"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import "@/style/main.css";
import "@/style/home.css";
import "@/style/auth.css";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero home-hero" aria-labelledby="register-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free forever — no credit card
        </div>

        <h1 id="register-heading" className="home-title">
          Create <em>account</em>
        </h1>

        <p className="home-subtitle">
          Join DevTools in seconds. Your data stays private,
          your converters stay unlimited, and your account stays yours.
        </p>
      </section>

      <section aria-labelledby="register-form-heading">
        <div className="auth-wrapper">
          <div className="auth-card">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <h2 id="register-form-heading" className="profile-section-title" style={{ marginBottom: 4 }}>
                New account details
              </h2>

              <div className="auth-field">
                <label htmlFor="register-username" className="auth-label">
                  Username
                </label>
                <input
                  id="register-username"
                  type="text"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_handle"
                  autoComplete="username"
                  required
                  minLength={2}
                />
                <span className="auth-hint">Letters, numbers and underscores</span>
              </div>

              <div className="auth-field">
                <label htmlFor="register-email" className="auth-label">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-password" className="auth-label">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <span className="auth-hint">At least 6 characters</span>
              </div>

              {error && (
                <div className="auth-alert error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-convert auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} aria-hidden="true" />
                    Create account
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?
              <Link href="/user/login">Sign in</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}