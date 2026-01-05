import { useEffect, useState } from "react";

export default function Performer() {
  const [code, setCode] = useState("");
  const [polling, setPolling] = useState(false);
  const [entry, setEntry] = useState(null);
  const [msg, setMsg] = useState("");

  async function fetchLatest(c) {
    const r = await fetch(`/.netlify/functions/get-latest-entry?code=${encodeURIComponent(c)}`);
    if (!r.ok) throw new Error("Fetch failed");
    return r.json();
  }

  useEffect(() => {
    if (!polling) return;

    let alive = true;
    const tick = async () => {
      try {
        const data = await fetchLatest(code.trim());
        if (!alive) return;
        setEntry(data);
        setMsg(data?.entry_text ? "" : "Waiting for entry…");
      } catch {
        if (!alive) return;
        setMsg("Could not fetch.");
      }
    };

    tick();
    const id = setInterval(tick, 900);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [polling, code]);

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <h1>Performer Console</h1>
          <p className="sub">Enter the spectator’s session code.</p>
        </div>
        <a className="tinyLink" href="/">Spectator</a>
      </header>

      <div className="card">
        <label className="label">Session code</label>
        <input
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 4821"
        />

        <button
          className="btn"
          onClick={() => {
            if (!code.trim()) return setMsg("Enter a session code.");
            setPolling(true);
            setMsg("Scanning…");
          }}
        >
          Start
        </button>

        <div className="revealBox">
          <div className="label">Latest entry</div>
          <div className="revealText">
            {entry?.entry_text || msg || "—"}
          </div>
          {entry?.created_at && (
            <div className="muted tiny">
              {new Date(entry.created_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
