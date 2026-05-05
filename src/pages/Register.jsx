import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { createClub, joinClub } from "../utils/firestore";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [clubOption, setClubOption] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubCode, setClubCode] = useState("");

  async function handleAccount(e) {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    setError("");
    setLoading(true);
    try {
      const cred = await register(email, password);
      setUserId(cred.user.uid);
      setStep(2);
    } catch (err) {
      setError("Error creating account. Try another email");
    }
    setLoading(false);
  }

  async function handleClub(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (clubOption === "create") {
        const { code } = await createClub(clubName, userId);
        alert(`Club created! Your code is: ${code} — share it with your team`);
      } else {
        await joinClub(clubCode.toUpperCase(), userId);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (step === 2) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 20px" }}>
        <h2>Join or create a club</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setClubOption("create")}>Create club</button>
          <button onClick={() => setClubOption("join")}>Join club</button>
        </div>

        {clubOption === "create" && (
          <form onSubmit={handleClub}>
            <label>Club name</label>
            <input
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create club"}
            </button>
          </form>
        )}

        {clubOption === "join" && (
          <form onSubmit={handleClub}>
            <label>Club code</label>
            <input
              value={clubCode}
              onChange={(e) => setClubCode(e.target.value)}
              placeholder="Ex: AB12CD"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join club"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 20px" }}>
      <h1>Rugby Analytics</h1>
      <h2>Create account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAccount}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}