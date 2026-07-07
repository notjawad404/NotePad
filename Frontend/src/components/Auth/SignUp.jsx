import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../redux/authSlice";
import Layout from "../common/Layout";
import { TextInput, PasswordInput } from "../common/FormField";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";
import logo from "../../assets/notepadLogo.jpeg";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!username || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const result = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <Layout center>
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="NotePad logo" className="w-12 h-12 rounded-lg ring-1 ring-slate-700 object-cover mb-3" />
          <h1 className="text-xl font-semibold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Start capturing notes and flashcards</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <TextInput
            id="signup-username"
            label="Username"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            id="signup-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            id="signup-password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            id="signup-confirm-password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Alert variant="error">{formError || error}</Alert>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Spinner className="w-4 h-4" />}
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Log In
          </Link>
        </p>
      </div>
    </Layout>
  );
}
