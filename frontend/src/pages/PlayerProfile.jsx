import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const PLAYERS_URL = `${API_BASE}/api/players`;

const emptyForm = {
  name: "",
  phone: "",
  jerseyNumber: "",
  photoUrl: "",
  dob: "",
  batStyle: "",
  bowlStyle: "",
  batting: {
    matches: 0,
    runs: 0,
    balls: 0,
    highest: 0,
    fifties: 0,
    hundreds: 0,
    average: 0,
    strikeRate: 0,
  },
  bowling: {
    matches: 0,
    balls: 0,
    runsConceded: 0,
    wickets: 0,
    best: "0/0",
    average: 0,
    economy: 0,
    fiveFors: 0,
  },
  fielding: {
    catches: 0,
    stumpings: 0,
    runouts: 0,
  },
};

function useAuthToken() {
  const { user } = useAuth();
  return user?.token || localStorage.getItem("token") || "";
}

export default function PlayerProfile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const token = useAuthToken();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingPhone, setEditingPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  async function fetchPlayers() {
    setLoading(true);
    setErr("");
    try {
      const { data } = await axios.get(PLAYERS_URL);
      setPlayers(data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load players");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  function updateNested(path, value) {
    setForm((prev) => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      let ptr = clone;
      for (let i = 0; i < keys.length - 1; i++) ptr = ptr[keys[i]];
      ptr[keys.at(-1)] = value;
      return clone;
    });
  }

  function onEdit(p) {
    setEditingPhone(p.phone);
    setForm({
      ...emptyForm,
      ...p,
      jerseyNumber: p?.jerseyNumber ?? "",
      batting: { ...emptyForm.batting, ...(p.batting || {}) },
      bowling: { ...emptyForm.bowling, ...(p.bowling || {}) },
      fielding: { ...emptyForm.fielding, ...(p.fielding || {}) },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingPhone("");
  }

  async function onSave(e) {
    e?.preventDefault?.();
    setSaving(true);
    setErr("");
    try {
      const payload = {
        ...form,
        jerseyNumber:
          form.jerseyNumber === "" ? undefined : Number(form.jerseyNumber),
      };
      if (editingPhone) {
        const { data } = await axios.patch(
          `${PLAYERS_URL}/${encodeURIComponent(editingPhone)}`,
          payload,
          { headers }
        );
        setPlayers((prev) =>
          prev.map((p) => (p.phone === editingPhone ? data.data : p))
        );
      } else {
        const { data } = await axios.post(PLAYERS_URL, payload, { headers });
        setPlayers((prev) => [data.data, ...prev]);
      }
      resetForm();
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(phone) {
    if (!confirm("Delete this player?")) return;
    setErr("");
    try {
      await axios.delete(`${PLAYERS_URL}/${encodeURIComponent(phone)}`, {
        headers,
      });
      setPlayers((prev) => prev.filter((p) => p.phone !== phone));
      if (editingPhone === phone) resetForm();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        String(p.jerseyNumber || "").includes(q) ||
        p.phone?.includes(q)
    );
  }, [players, search]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Player Profiles
            </h1>
            <p className="text-slate-600">
              View stats{isAdmin ? ", manage roster" : ""} and search players
            </p>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, jersey or phone"
              className="pl-10 pr-3 py-2 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </header>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            {err}
          </div>
        )}

        {/* --- Admin Form: hidden for normal users --- */}
        {isAdmin && (
          <section className="mb-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
              <div className="p-4 md:p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FaPlus />
                  {editingPhone ? "Update Player" : "Add Player"}
                </h2>
                <p className="text-slate-600 text-sm">
                  Phone number is used as the unique identifier.
                </p>
              </div>

              <form
                onSubmit={onSave}
                className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Basic */}
                <Input
                  label="Name*"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  required
                />
                <Input
                  label="Phone*"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                  required
                  disabled={!!editingPhone}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {/* jersey: numeric text box (no arrows) */}
                <Input
                  label="Jersey #"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={String(form.jerseyNumber ?? "")}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      jerseyNumber:
                        v.replace(/\D+/g, "") // keep digits only
                        ,
                    }))
                  }
                />
                <Input
                  label="Photo URL"
                  value={form.photoUrl}
                  onChange={(v) => setForm((f) => ({ ...f, photoUrl: v }))}
                />
                {/* DOB with calendar */}
                <Input
                  label="DOB"
                  type="date"
                  value={form.dob || ""}
                  onChange={(v) => setForm((f) => ({ ...f, dob: v }))}
                />

                {/* 2-option sliders */}
                <Seg2
                  label="Bat Style"
                  left={{ value: "RHB", title: "RHB" }}
                  right={{ value: "LHB", title: "LHB" }}
                  value={form.batStyle}
                  onChange={(v) => setForm((f) => ({ ...f, batStyle: v }))}
                />
                <Seg2
                  label="Bowl Style"
                  left={{ value: "Right-arm", title: "Right-arm" }}
                  right={{ value: "Left-arm", title: "Left-arm" }}
                  value={form.bowlStyle}
                  onChange={(v) => setForm((f) => ({ ...f, bowlStyle: v }))}
                />

                {/* Batting */}
                <StatGroup title="Batting">
                  <Num label="Matches" path="batting.matches" value={form.batting.matches} onChange={updateNested} />
                  <Num label="Runs" path="batting.runs" value={form.batting.runs} onChange={updateNested} />
                  <Num label="Balls" path="batting.balls" value={form.batting.balls} onChange={updateNested} />
                  <Num label="Highest" path="batting.highest" value={form.batting.highest} onChange={updateNested} />
                  <Num label="50s" path="batting.fifties" value={form.batting.fifties} onChange={updateNested} />
                  <Num label="100s" path="batting.hundreds" value={form.batting.hundreds} onChange={updateNested} />
                  <Num label="Average" step="0.01" path="batting.average" value={form.batting.average} onChange={updateNested} />
                  <Num label="Strike Rate" step="0.01" path="batting.strikeRate" value={form.batting.strikeRate} onChange={updateNested} />
                </StatGroup>

                {/* Bowling */}
                <StatGroup title="Bowling">
                  <Num label="Matches" path="bowling.matches" value={form.bowling.matches} onChange={updateNested} />
                  <Num label="Balls" path="bowling.balls" value={form.bowling.balls} onChange={updateNested} />
                  <Num label="Runs Conceded" path="bowling.runsConceded" value={form.bowling.runsConceded} onChange={updateNested} />
                  <Num label="Wickets" path="bowling.wickets" value={form.bowling.wickets} onChange={updateNested} />
                  <Input label="Best (e.g., 5/12)" value={form.bowling.best} onChange={(v) => updateNested("bowling.best", v)} />
                  <Num label="Average" step="0.01" path="bowling.average" value={form.bowling.average} onChange={updateNested} />
                  <Num label="Economy" step="0.01" path="bowling.economy" value={form.bowling.economy} onChange={updateNested} />
                  <Num label="Five-fors" path="bowling.fiveFors" value={form.bowling.fiveFors} onChange={updateNested} />
                </StatGroup>

                {/* Fielding */}
                <StatGroup title="Fielding">
                  <Num label="Catches" path="fielding.catches" value={form.fielding.catches} onChange={updateNested} />
                  <Num label="Stumpings" path="fielding.stumpings" value={form.fielding.stumpings} onChange={updateNested} />
                  <Num label="Runouts" path="fielding.runouts" value={form.fielding.runouts} onChange={updateNested} />
                </StatGroup>

                <div className="md:col-span-3 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingPhone ? "Update Player" : "Add Player"}
                  </button>
                  {editingPhone && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {/* --- List / Viewer (visible to all) --- */}
        <section>
          {loading ? (
            <div className="text-slate-600">Loading players…</div>
          ) : filtered.length === 0 ? (
            <div className="text-slate-600">No players found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PlayerCard
                  key={p.phone}
                  player={p}
                  isAdmin={isAdmin}
                  onEdit={() => onEdit(p)}
                  onDelete={() => onDelete(p.phone)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */

function Input({ label, value, onChange, type = "text", ...rest }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
        {...rest}
      />
    </label>
  );
}

// Numeric text box (no arrows). Defaults to 0 if empty/invalid.
function Num({ label, path, value, onChange, step = "1" }) {
  const allowDecimal = step !== "1";
  const display = String(value ?? 0);

  function toNumberString(raw) {
    let s = String(raw || "");
    // keep digits and at most one dot if decimals allowed
    if (allowDecimal) {
      s = s.replace(/[^\d.]/g, "");
      const parts = s.split(".");
      if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("");
    } else {
      s = s.replace(/\D+/g, "");
    }
    return s;
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        type="text"
        inputMode={allowDecimal ? "decimal" : "numeric"}
        pattern={allowDecimal ? "[0-9]*[.]?[0-9]*" : "[0-9]*"}
        value={display}
        onChange={(e) => {
          const cleaned = toNumberString(e.target.value);
          const num = cleaned === "" || cleaned === "." ? 0 : Number(cleaned);
          onChange(path, Number.isFinite(num) ? num : 0);
        }}
        className="px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </label>
  );
}

function StatGroup({ title, children }) {
  return (
    <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-semibold mb-3 text-slate-800">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </div>
  );
}

/** 2-option pill slider (segmented control) */
function Seg2({ label, left, right, value, onChange }) {
  const isLeft = value === left.value;
  const isRight = value === right.value;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="inline-flex rounded-xl border border-slate-300 p-1 bg-white">
        <button
          type="button"
          onClick={() => onChange(left.value)}
          className={`px-4 py-2 rounded-lg transition ${
            isLeft
              ? "bg-violet-600 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {left.title}
        </button>
        <button
          type="button"
          onClick={() => onChange(right.value)}
          className={`px-4 py-2 rounded-lg transition ${
            isRight
              ? "bg-violet-600 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {right.title}
        </button>
      </div>
    </div>
  );
}

/** 3D-ish card: heavy shadow, transform on hover, subtle border and hover ring */
function PlayerCard({ player, isAdmin, onEdit, onDelete }) {
  const b = player.batting || {};
  const w = player.bowling || {};
  const f = player.fielding || {};

  return (
    <div
      className="
        group rounded-2xl overflow-hidden border border-slate-200 bg-white
        shadow-xl transition-transform duration-300 will-change-transform
        hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl
      "
    >
      <div className="p-4 flex items-center gap-4 border-b border-slate-200">
        <img
          src={
            player.photoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              player.name || "P"
            )}`
          }
          alt={player.name}
          className="
            w-16 h-16 rounded-xl object-cover bg-slate-100
            ring-1 ring-slate-200 group-hover:ring-violet-300 transition
          "
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-extrabold text-slate-900">{player.name}</h4>
            {player.jerseyNumber !== null && player.jerseyNumber !== undefined && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                #{player.jerseyNumber}
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm">{player.phone}</p>
          {(player.batStyle || player.bowlStyle) && (
            <p className="text-slate-500 text-xs">
              {player.batStyle ? `Bat: ${player.batStyle}` : ""}
              {player.batStyle && player.bowlStyle ? " • " : ""}
              {player.bowlStyle ? `Bowl: ${player.bowlStyle}` : ""}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat
          title="Batting"
          items={[
            ["Matches", b.matches],
            ["Runs", b.runs],
            ["Balls", b.balls],
            ["Highest", b.highest],
            ["50s/100s", `${b.fifties || 0}/${b.hundreds || 0}`],
            ["Avg / SR", `${b.average ?? 0} / ${b.strikeRate ?? 0}`],
          ]}
        />
        <Stat
          title="Bowling"
          items={[
            ["Matches", w.matches],
            ["Balls", w.balls],
            ["Runs", w.runsConceded],
            ["Wickets", w.wickets],
            ["Best", w.best || "0/0"],
            ["Avg / Eco", `${w.average ?? 0} / ${w.economy ?? 0}`],
          ]}
        />
        <Stat
          title="Fielding"
          items={[
            ["Catches", f.catches],
            ["Stumpings", f.stumpings],
            ["Runouts", f.runouts],
          ]}
        />
      </div>
    </div>
  );
}

function Stat({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="px-3 py-2 border-b border-slate-200 text-slate-800 font-semibold">
        {title}
      </div>
      <div className="p-3 text-sm">
        <dl className="space-y-1">
          {items.map(([k, v]) => (
            <div className="flex justify-between gap-3" key={k}>
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-semibold text-slate-900">
                {Number.isFinite(v) ? v : v ?? 0}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
