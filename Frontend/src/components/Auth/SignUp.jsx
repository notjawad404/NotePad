import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../redux/authSlice";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!username || !email || !password) {
            setFormError("Please fill in all fields.");
            return;
        }

        const result = await dispatch(registerUser({ username, email, password }));
        if (registerUser.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-center text-3xl font-bold mb-6">Sign Up</h1>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {(formError || error) && (
                        <p className="text-red-500 bg-gray-900 p-3 rounded-lg">{formError || error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`w-full py-3 bg-blue-500 text-lg font-bold rounded-lg hover:bg-blue-600 focus:outline-none ${
                            status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {status === "loading" ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
