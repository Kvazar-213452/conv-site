import { NextRequest } from "next/server";
import db from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUser,
} from "@/lib/auth";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = db
    .prepare("SELECT id, username, email, avatar, bio, created_at FROM users WHERE id = ?")
    .get(session.id);

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({ user });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "register") {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
      .get(username, email);

    if (existing) {
      return Response.json({ error: "User with this username or email exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const result = db
      .prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
      .run(username, email, hashed);

    const id = result.lastInsertRowid as number;
    const token = signToken({ id, username });
    await setAuthCookie(token);

    return Response.json({
      msg: "Registered successfully",
      user: { id, username, email },
    });
  }

  if (action === "login") {
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ error: "Username and password required" }, { status: 400 });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
      .get(username, username) as User | undefined;

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username });
    await setAuthCookie(token);

    return Response.json({
      msg: "Logged in",
      user: { id: user.id, username: user.username, email: user.email },
    });
  }

  if (action === "logout") {
    await clearAuthCookie();
    return Response.json({ msg: "Logged out" });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { username, email, bio, avatar, password } = body;

  const updates: string[] = [];
  const values: any[] = [];

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (bio !== undefined) {
    updates.push("bio = ?");
    values.push(bio);
  }
  if (avatar !== undefined) {
    updates.push("avatar = ?");
    values.push(avatar);
  }
  if (password) {
    if (password.length < 6) {
      return Response.json({ error: "Password too short" }, { status: 400 });
    }
    updates.push("password = ?");
    values.push(await hashPassword(password));
  }

  if (updates.length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(session.id);

  try {
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  } catch (e: any) {
    return Response.json({ error: "Update failed: " + e.message }, { status: 400 });
  }

  const user = db
    .prepare("SELECT id, username, email, avatar, bio FROM users WHERE id = ?")
    .get(session.id);

  return Response.json({ msg: "Profile updated", user });
}

export async function DELETE() {
  const session = await getCurrentUser();
  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(session.id);
  await clearAuthCookie();

  return Response.json({ msg: "Account deleted" });
}
