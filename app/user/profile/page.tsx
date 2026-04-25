"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";

import "@/style/main.css";
import "@/style/home.css";
import "@/style/auth.css";

interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setBio(data.user.bio || "");
          setUsername(data.user.username);
          setEmail(data.user.email);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, bio }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "Update failed" });
      } else {
        setMsg({ type: "success", text: data.msg || "Profile updated" });
        if (data.user) setUser(data.user);
      }
    } catch {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;

    await fetch("/api/user", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <section>
        <div className="profile-loading">Loading profile...</div>
      </section>
    );
  }

  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <>
      <section className="hero home-hero" aria-labelledby="profile-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Account settings
        </div>

        <h1 id="profile-heading" className="home-title">
          Your <em>profile</em>
        </h1>

        <p className="home-subtitle">
          Manage your account details, update your information,
          and control your data — all in one place.
        </p>
      </section>

      <section aria-label="Profile management">
        <div className="profile-grid">
          {/* ── Identity ──────────────────────────────────── */}
          <div className="profile-identity">
            <div className="profile-identity-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="profile-identity-info">
              <div className="profile-identity-name">{user.username}</div>
              <div className="profile-identity-email">{user.email}</div>
            </div>
          </div>

          {/* ── Edit profile ──────────────────────────────── */}
          <div className="profile-section">
            <div className="profile-section-header">
              <span className="profile-section-title">Edit profile</span>
            </div>
            <div className="profile-section-body">
              <form className="auth-form" onSubmit={handleUpdate} noValidate>
                <div className="auth-field">
                  <label htmlFor="profile-username" className="auth-label">
                    Username
                  </label>
                  <input
                    id="profile-username"
                    type="text"
                    className="auth-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="profile-email" className="auth-label">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="profile-bio" className="auth-label">
                    Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    className="auth-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    maxLength={500}
                  />
                  <span className="auth-hint">{bio.length} / 500 characters</span>
                </div>

                {msg && (
                  <div className={`auth-alert ${msg.type}`} role="status">
                    {msg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-convert auth-submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} aria-hidden="true" />
                      Save changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Danger zone ──────────────────────────────── */}
          <div className="profile-section danger">
            <div className="profile-section-header">
              <span className="profile-section-title">Danger zone</span>
            </div>
            <div className="profile-section-body">
              <div className="profile-danger-row">
                <div className="profile-danger-text">
                  <h4>Delete account</h4>
                  <p>
                    Permanently remove your account and all related data.
                    This action cannot be reversed.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} aria-hidden="true" style={{ marginRight: 6, verticalAlign: "-2px" }} />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}