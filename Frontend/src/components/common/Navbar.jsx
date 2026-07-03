import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/notepadLogo.jpeg";
import { logout } from "../../redux/authSlice";
import { MenuIcon, CloseIcon, LogoutIcon } from "./Icons";

const links = [
  { to: "/", label: "Notes", end: true },
  { to: "/addnotes", label: "Add Note" },
  { to: "/flashcards", label: "Flashcards" },
  { to: "/addflashcards", label: "Add Flashcard" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `block md:inline-block text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
    }`;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="NotePad logo" className="w-8 h-8 rounded-lg ring-1 ring-slate-700 object-cover" />
            <span className="text-slate-100 font-semibold text-lg tracking-tight">NotePad</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs uppercase text-slate-300">
                    {user.username?.[0] ?? "?"}
                  </span>
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-300 text-sm font-medium border border-slate-800 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <LogoutIcon className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-300 p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-300 text-sm font-medium border border-slate-800 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors mt-2"
              >
                <LogoutIcon className="w-4 h-4" />
                Logout ({user.username})
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
