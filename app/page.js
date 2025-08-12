"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState(["", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  async function fetchLeaderboard() {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setPlayers(data);
  }

  async function submitGame() {
    const res = await fetch("/api/add-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Game recorded!");
      setResults(["", "", "", ""]);
      setPassword("");
      setShowModal(false);
      fetchLeaderboard();
    } else {
      alert(data.message || "Error");
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "white" }}>🎲 Ludo Leaderboard</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <thead style={{ backgroundColor: "#2563eb", color: "white" }}>
          <tr>
            {["Name", "Games Played", "1st", "2nd", "3rd", "4th", "Score"].map((h) => (
              <th key={h} style={{ padding: "12px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => (
            <tr key={p.name} style={{ backgroundColor: idx % 2 === 0 ? "#f9fafb" : "white" }}>
              <td style={{ padding: "10px", fontWeight: "bold", color: "black" }}>{p.name}</td>
              <td style={{ padding: "10px", textAlign: "center", color: "black" }}>{p.games_played}</td>
              <td style={{ padding: "10px", color: "green", fontWeight: "bold", textAlign: "center" }}>{p.first_place}</td>
              <td style={{ padding: "10px", color: "blue", textAlign: "center" }}>{p.second_place}</td>
              <td style={{ padding: "10px", color: "orange", textAlign: "center" }}>{p.third_place}</td>
              <td style={{ padding: "10px", color: "red", textAlign: "center" }}>{p.fourth_place}</td>
              <td style={{ padding: "10px", fontWeight: "bold", textAlign: "center", color: "black" }}>{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginTop: "30px" }}>Add New Game</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {["1st Place", "2nd Place", "3rd Place", "4th Place"].map((label, i) => (
          <div key={i}>
            <label style={{ fontWeight: "bold" }}>{label}:</label>
            <input
              type="text"
              value={results[i]}
              onChange={(e) => {
                const newResults = [...results];
                newResults[i] = e.target.value;
                setResults(newResults);
              }}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
              placeholder="Player Name"
            />
          </div>
        ))}
      </div>
      <button
  onClick={() => {
    const trimmed = results.map((n) => n.trim().toLowerCase());
    if (new Set(trimmed).size !== trimmed.length) {
      alert("Duplicate names are not allowed in the same game!");
      return;
    }
    setShowModal(true);
  }}
  style={{ marginTop: "10px", backgroundColor: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}
>
  Submit Game
</button>


      {/* Password Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "300px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "black" }}>Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%", marginBottom: "10px" }}
            />
            <div>
              <button
                onClick={submitGame}
                style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", marginRight: "10px" }}
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ backgroundColor: "#ccc", padding: "8px 16px", border: "none", borderRadius: "6px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
