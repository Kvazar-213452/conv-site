"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

import "@/style/main.css";
import "@/style/home.css";
import "@/style/auth.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ action: "login", username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
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
      <section className="hero home-hero" aria-labelledby="login-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Welcome back
        </div>

        <h1 id="login-heading" className="home-title">
          Sign <em>in</em>
        </h1>

        <p className="home-subtitle">
          Access your DevTools account to sync your preferences,
          manage your profile, and pick up where you left off.
        </p>
      </section>

      <section aria-labelledby="login-form-heading">
        <div className="auth-wrapper">
          <div className="auth-card">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <h2 id="login-form-heading" className="profile-section-title" style={{ marginBottom: 4 }}>
                Account credentials
              </h2>

              <div className="auth-field">
                <label htmlFor="login-username" className="auth-label">
                  Username or email
                </label>
                <input
                  id="login-username"
                  type="text"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_handle"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password" className="auth-label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} aria-hidden="true" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              No account yet?
              <Link href="/user/register">Create one</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}