// src/pages/Teams.jsx
import React, { useEffect, useMemo, useState } from "react";

const SECTIONS = ["GICPL-OG", "GICPL-H"];

// ✅ Use env if present, else fallback to your Render backend
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://gicpl-fullstack-backend.onrender.com"
).replace(/\/$/, "");

// ---- tiny fetch helpers (no external api.js) ----
async function request(path, { method = "GET", body, auth = false } = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

const api = {
  listTeams: () => request(`/api/teams`),
  getTeam: (id) => request(`/api/teams/${id}`),
  createTeam: (payload) => request(`/api/teams`, { method: "POST", body: payload, auth: true }),
  deleteTeam: (id) => request(`/api/teams/${id}`, { method: "DELETE", auth: true }),
  addPlayer: (teamId, payload) =>
    request(`/api/teams/${teamId}/players`, { method: "POST", body: payload, auth: true }),
  removePlayer: (teamId, playerId) =>
    request(`/api/teams/${teamId}/players/${playerId}`, { method: "DELETE", auth: true }),
};

export default function Teams() {
  // Simple admin gate via localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const isAdmin = !!token || role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [activeSection, setActiveSection] = useState("GICPL-OG");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [busy, setBusy] = useState(false);

  // Admin form
  const [form, setForm] = useState({
    section: "GICPL-OG",
    name: "",
    captain: "",
    players: [""],
  });

  // Quick-add player
  const [newPlayer, setNewPlayer] = useState({ name: "", role: "Player" });

  const grouped = useMemo(() => {
    const g = { "GICPL-OG": [], "GICPL-H": [] };
    teams.forEach((t) => g[t.section]?.push(t));
    SECTIONS.forEach((s) => g[s].sort((a, b) => a.name.localeCompare(b.name)));
    return g;
  }, [teams]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await api.listTeams();
      setTeams(res?.data || []);
    } catch (e) {
      console.error("Failed to load teams:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ---- Admin ops ----
  const createTeam = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        section: form.section,
        name: form.name.trim(),
        captain: form.captain.trim(),
        players: form.players
          .map((p) => p.trim())
          .filter(Boolean)
          .map((name) => ({ name, role: "Player" })),
      };
      await api.createTeam(payload);
      setForm({ section: "GICPL-OG", name: "", captain: "", players: [""] });
      await fetchTeams();
      alert("Team created");
    } catch (e) {
      alert(e.message || "Failed to create team");
    } finally {
      setBusy(false);
    }
  };

  const deleteTeam = async (teamId) => {
    if (!confirm("Delete this team?")) return;
    setBusy(true);
    try {
      await api.deleteTeam(teamId);
      if (selectedTeam?._id === teamId) setSelectedTeam(null);
      await fetchTeams();
    } catch (e) {
      alert(e.message || "Failed to delete team");
    } finally {
      setBusy(false);
    }
  };

  const addPlayer = async (teamId) => {
    if (!newPlayer.name.trim()) return;
    setBusy(true);
    try {
      const res = await api.addPlayer(teamId, {
        name: newPlayer.name.trim(),
        role: newPlayer.role,
      });
      setSelectedTeam(res?.data || null);
      setNewPlayer({ name: "", role: "Player" });
      await fetchTeams();
    } catch (e) {
      alert(e.message || "Failed to add player");
    } finally {
      setBusy(false);
    }
  };

  const removePlayer = async (teamId, playerId) => {
    if (!confirm("Remove this player?")) return;
    setBusy(true);
    try {
      const res = await api.removePlayer(teamId, playerId);
      setSelectedTeam(res?.data || null);
      await fetchTeams();
    } catch (e) {
      alert(e.message || "Failed to remove player");
    } finally {
      setBusy(false);
    }
  };

  const openTeam = (team) => {
    setSelectedTeam(team);
    setNewPlayer({ name: "", role: "Player" });
  };

  const handleFormPlayerChange = (i, val) => {
    const next = [...form.players];
    next[i] = val;
    setForm((f) => ({ ...f, players: next }));
  };
  const addFormPlayerField = () => setForm((f) => ({ ...f, players: [...f.players, ""] }));
  const removeFormPlayerField = (i) =>
    setForm((f) => ({ ...f, players: f.players.filter((_, idx) => idx !== i) }));

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
        🏏 GICPL Teams
      </h1>

      {/* Admin quick tools — visible ONLY to admins */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-xl shadow">
          <details>
            <summary className="cursor-pointer font-semibold">Admin Tools</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">JWT Token</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 h-24"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste admin JWT here"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("token", token.trim());
                      alert("Token saved");
                    }}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Save Token
                  </button>
                  <button
                    onClick={() => {
                      setToken("");
                      localStorage.removeItem("token");
                      alert("Token cleared");
                    }}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Clear Token
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">(none)</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("role", role);
                      alert("Role saved");
                    }}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Save Role
                  </button>
                  <button
                    onClick={() => {
                      setRole("");
                      localStorage.removeItem("role");
                      alert("Role cleared");
                    }}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Clear Role
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Admin panel appears only if a token is set or role is ADMIN.
            </p>
          </details>
        </div>
      )}

      {/* Section switcher */}
      <div className="flex justify-center gap-3 mb-8">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-full border transition ${
              activeSection === s
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Admin Panel: Create Team (only for admins) */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto mb-10 bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Admin: Add Team</h3>
          <form onSubmit={createTeam} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.section}
                onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. NKT (Nikhil Ke Trailblazers)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Captain</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.captain}
                onChange={(e) => setForm((f) => ({ ...f, captain: e.target.value }))}
                placeholder="e.g. Nikhil Yadav"
                required
              />
            </div>

            {/* Initial players (optional) */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Initial Players (optional)</label>
                <button
                  type="button"
                  onClick={addFormPlayerField}
                  className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
                >
                  + Add field
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {form.players.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2"
                      value={p}
                      onChange={(e) => handleFormPlayerChange(i, e.target.value)}
                      placeholder={`Player ${i + 1}`}
                    />
                    {form.players.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFormPlayerField(i)}
                        className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={busy}
                className={`px-5 py-2 rounded-lg text-white transition ${
                  busy ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {busy ? "Please wait…" : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams grid */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
          {activeSection}
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading teams…</p>
        ) : grouped[activeSection].length === 0 ? (
          <p className="text-center text-gray-600">No teams yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {grouped[activeSection].map((team) => (
              <div
                key={team._id}
                onClick={() => openTeam(team)}
                className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  {team.name}
                </h3>
                <p className="text-gray-600 mt-2">
                  Captained by <span className="font-semibold text-blue-600">{team.captain}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal: Team Details */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-start justify-between">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {selectedTeam.name}
              </h2>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 mb-2">
              Section: <span className="font-semibold">{selectedTeam.section}</span>
            </p>
            <p className="text-gray-700 mb-4">
              Captain: <span className="font-semibold text-blue-600">{selectedTeam.captain}</span>
            </p>

            <h4 className="text-xl font-semibold mb-2">Players</h4>
            {!selectedTeam.players || selectedTeam.players.length === 0 ? (
              <p className="text-gray-600">No players yet.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-800 space-y-1 mb-4">
                {selectedTeam.players.map((p) => (
                  <li key={p._id || p.name} className="flex items-center justify-between gap-2">
                    <span>
                      {p.name}
                      {p.role && p.role !== "Player" ? ` (${p.role})` : ""}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePlayer(selectedTeam._id, p._id);
                        }}
                        className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {isAdmin && (
              <>
                <div className="flex items-end gap-2 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Add Player</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer((np) => ({ ...np, name: e.target.value }))}
                      placeholder="Player name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      className="border rounded-lg px-3 py-2"
                      value={newPlayer.role}
                      onChange={(e) => setNewPlayer((np) => ({ ...np, role: e.target.value }))}
                    >
                      <option>Player</option>
                      <option>C</option>
                      <option>VC</option>
                      <option>WK</option>
                    </select>
                  </div>
                  <button
                    onClick={() => addPlayer(selectedTeam._id)}
                    disabled={busy}
                    className={`h-10 px-4 rounded-lg text-white ${
                      busy ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    Add
                  </button>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.getTeam(selectedTeam._id);
                        setSelectedTeam(res?.data || selectedTeam);
                      } catch (e) {
                        console.error("Refresh failed:", e.message);
                      }
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Refresh
                  </button>

                  <button
                    onClick={() => deleteTeam(selectedTeam._id)}
                    disabled={busy}
                    className={`px-4 py-2 rounded-lg text-white ${
                      busy ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Delete Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
