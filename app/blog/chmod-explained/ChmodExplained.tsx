"use client";

import { Terminal, Shield, Lock } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

export default function ChmodExplained() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Unix · Permissions · Deep Dive
        </div>
        <h1 id="hero-heading">
          chmod <em>Explained</em>
        </h1>
        <p>
          Octal notation, symbolic notation, special bits, umask, and the chown
          relationship — the full picture of Unix file permissions in one post.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter" style={{ gridTemplateColumns: "1fr" }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Typical ls -l output
              </div>
            </div>
            <pre className="output-pre">
{`-rw-r--r--  1 alice staff   1.2K Jan 10 10:00  README.md
drwxr-xr-x  5 alice staff    160 Jan 10 10:00  src
-rwx------  1 alice staff   2.1K Jan 10 10:00  deploy.sh
-rw-r-----  1 alice admin    700 Jan 10 10:00  .env`}
            </pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Every File Has Three Audiences</h2>
        <p>
          Each Unix file carries three permission triads — for the <strong>owner</strong>,
          the <strong>group</strong>, and <strong>everyone else</strong>. Each triad
          records three bits: <strong>read</strong>, <strong>write</strong>, and
          <strong>execute</strong>. That is nine bits in total, plus three special
          bits that modify behavior.
        </p>

        <h3>Octal Math</h3>
        <p>
          Each permission is a power of two:
          <code> r = 4</code>, <code>w = 2</code>, <code>x = 1</code>. Add them to
          get each triad's digit. <code>rw- = 6</code>, <code>r-x = 5</code>,
          <code> rwx = 7</code>. The familiar <code>chmod 755</code> is
          <code> rwxr-xr-x</code>: owner can read/write/execute; group and others
          can read and execute but not write.
        </p>

        <h3>Reading <code>ls -l</code></h3>
        <p>
          The ten-character string starts with a file-type bit:
          <code> -</code> regular file, <code>d</code> directory,
          <code> l</code> symbolic link, <code>c</code> character device,
          <code> b</code> block device. The nine permission bits follow.
        </p>

        <h3>What Each Bit Means on Files vs Directories</h3>
        <ul>
          <li><strong>Read on a file</strong> — contents can be opened for reading</li>
          <li><strong>Read on a directory</strong> — names of entries can be listed (<code>ls</code>)</li>
          <li><strong>Write on a file</strong> — contents can be modified</li>
          <li><strong>Write on a directory</strong> — entries can be added, renamed, deleted</li>
          <li><strong>Execute on a file</strong> — the file can be run as a program</li>
          <li><strong>Execute on a directory</strong> — the directory can be traversed (<code>cd</code>, path lookup)</li>
        </ul>
        <p>
          Directory <code>r</code> without <code>x</code> means you can see the
          names but cannot <code>cd</code> or open the files. Directory
          <code> x</code> without <code>r</code> means you can traverse through
          but not list — common for restricted sharing.
        </p>

        <h3>Special Bits</h3>
        <ul>
          <li><strong>setuid (4000)</strong> — on an executable, runs as the owner. <code>passwd</code> uses this to let unprivileged users rewrite <code>/etc/shadow</code>.</li>
          <li><strong>setgid (2000)</strong> — on a directory, new entries inherit the directory's group. Perfect for shared project folders.</li>
          <li><strong>sticky (1000)</strong> — on a directory, only the owner of each file can delete or rename it. Set on <code>/tmp</code> so users can't nuke each other's temp files.</li>
        </ul>

        <h3>umask: The Permission Subtractor</h3>
        <p>
          When a program creates a new file it asks for a mode (usually
          <code> 666</code>) and new directories ask for <code>777</code>. The
          process's <code>umask</code> is subtracted from that request. A
          <code> umask</code> of <code>022</code> (common default) means new files
          become <code>644</code> and new directories <code>755</code>. Set a
          stricter <code>umask 077</code> if you want fresh files to be private
          by default.
        </p>

        <h3>chmod + chown Together</h3>
        <p>
          Permissions are only half the story — ownership matters too.
          <code> chown alice:web /var/www/site</code> transfers the file to user
          <code> alice</code> and group <code>web</code>. If a shared directory
          has mode <code>2775</code> (setgid + rwxrwxr-x), every new file inside
          automatically gets group <code>web</code> and group-write permissions —
          no manual <code>chmod</code> after each upload.
        </p>

        <h3>Common Patterns</h3>
        <ul>
          <li><code>chmod -R go-rwx ~/.ssh</code> — lock down SSH keys</li>
          <li><code>chmod 600 ~/.ssh/id_ed25519</code> — private keys must be user-only or OpenSSH refuses to use them</li>
          <li><code>chmod +x deploy.sh</code> — mark a script executable</li>
          <li><code>find . -type d -exec chmod 755 {"{}"} +</code> — fix directory perms</li>
          <li><code>find . -type f -exec chmod 644 {"{}"} +</code> — fix file perms</li>
          <li><code>chmod g+s /srv/shared</code> — new entries inherit the group</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Flip between numeric and symbolic notation with our free{" "}
          <Link href="/tools/unix-permissions">Unix Permissions Calculator</Link>.
          Need a strong SSH passphrase? The{" "}
          <Link href="/tools/password-generator">Password Generator</Link> is
          one click away.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Terminal size={24} />, title: "Octal is explicit",   desc: "r=4 w=2 x=1 — scripts and Dockerfiles always prefer numeric chmod." },
          { icon: <Shield size={24} />,  title: "Special bits save work", desc: "setgid on a dir keeps shared projects tidy without constant chown." },
          { icon: <Lock size={24} />,    title: "umask shapes defaults", desc: "A stricter umask protects you from accidentally world-readable files." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
