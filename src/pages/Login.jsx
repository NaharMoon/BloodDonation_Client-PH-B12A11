import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-[85vh] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-xl card-soft p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Welcome Back <span className="text-primary">🩸</span>
        </h1>
        <p className="mt-2 opacity-75">
          Login to continue managing donation requests.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="input-brand mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="input-brand mt-2"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-primary">
              {error}
            </div>
          )}

          <button
            className="btn-brand w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-sm mt-4 opacity-80">
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
