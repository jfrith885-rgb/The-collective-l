import { useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

function genCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function Spectator() {
  const [sessionCode] = useState(genCode);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");

  const trimmed = useMemo(() => text.trim(), [text]);

  async function onLock() {
    setStatus("");
    if (!trimmed) return setStatus("Type something first.");
    if (!consent) return setStatus("Please check the consent box.");

    const { error } = await supabase.from("entries").insert({
      session_code: sessionCode,
      entry_text: trimmed,
    });

    if (error) return setStatus("Could not submit. Try again.");
    setLocked(true);
    setStatus("Locked in. Put your phone face-down.");
  }

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <h1>Focus Calibration</h1>
          <p className="sub">A short attention &amp; recall test.</p>
        </div>
        <a className="tinyLink" href="/performer">Performer</a>
      </header>

      <div className="card">
        <div className="row">
          <span className="badge">Session</span>
          <span className="mono">{sessionCode}</span>
        </div>

        {!locked ? (
          <>
            <label className="label">Type any word or phrase</label>
            <textarea
              className="input"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Anything at all…"
              maxLength={140}
            />

            <label className="consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I understand my entry will be transmitted to the performer for this demonstration.
              </span>
            </label>

            <button className="btn" onClick={onLock}>Lock it in</button>
          </>
        ) : (
          <>
            <div className="locked">
              <div className="big">Locked.</div>
              <div className="small">Do not change your mind.</div>
            </div>
            <p className="hint">Wait for the performer.</p>
          </>
        )}

        {status && <div className="status">{status}</div>}
      </div>

      <footer className="foot">
        <span className="muted">Session code is used to match your entry.</span>
      </footer>
    </div>
  );
}
