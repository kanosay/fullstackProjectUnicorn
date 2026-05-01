import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <main className="login">
      <div className="login__box">
        <h1>Sign In</h1>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn btn--primary btn--block">Sign In</button>
        </form>
        <p className="login__hint">Demo only — any credentials work.</p>
      </div>
    </main>
  );
}
