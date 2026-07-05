import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../redux/authSlice";
import Layout from "../common/Layout";
import { TextInput } from "../common/FormField";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";
import logo from "../../assets/notepadLogo.jpeg";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <Layout center>
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="NotePad logo" className="w-12 h-12 rounded-lg ring-1 ring-slate-700 object-cover mb-3" />
          <h1 className="text-xl font-semibold text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Log in to your NotePad account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <TextInput
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Alert variant="error">{error}</Alert>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Spinner className="w-4 h-4" />}
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </Layout>
  );
}
