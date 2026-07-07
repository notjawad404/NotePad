import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword } from "../redux/authSlice";
import Navbar from "./common/Navbar";
import Layout from "./common/Layout";
import { TextInput, PasswordInput } from "./common/FormField";
import Alert from "./common/Alert";
import Spinner from "./common/Spinner";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Change Password" },
];

export default function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";
  const [activeTab, setActiveTab] = useState("profile");

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFormError, setPasswordFormError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!username || !email) {
      setFormError("Username and email are required.");
      return;
    }
    setFormError("");

    const result = await dispatch(updateProfile({ username, email }));
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage("Profile updated successfully!");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordFormError("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordFormError("New password and confirmation do not match.");
      return;
    }
    setPasswordFormError("");
    setPasswordLoading(true);

    const result = await dispatch(changePassword({ currentPassword, newPassword }));
    setPasswordLoading(false);

    if (changePassword.fulfilled.match(result)) {
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setPasswordFormError(result.payload || "Failed to update password.");
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Your Account</h1>

        <div className="flex gap-1 border-b border-slate-800 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-500 text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          {activeTab === "profile" ? (
            <form onSubmit={handleSave} className="space-y-5">
              <TextInput
                id="profile-username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
              <TextInput
                id="profile-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Alert variant="error">{formError || error}</Alert>
              <Alert variant="success">{successMessage}</Alert>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading && <Spinner className="w-4 h-4" />}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <PasswordInput
                id="profile-current-password"
                label="Current Password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordInput
                id="profile-new-password"
                label="New Password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordInput
                id="profile-confirm-new-password"
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <Alert variant="error">{passwordFormError}</Alert>
              <Alert variant="success">{passwordSuccess}</Alert>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {passwordLoading && <Spinner className="w-4 h-4" />}
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
