import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeProvider";

const navClass = ({ isActive }) =>
  isActive ? "navlink navlink-active" : "navlink";

// ✅ Dropdown item class (active + hover clear)
const ddClass = ({ isActive }) =>
  [
    "block px-3 py-2 rounded-2xl transition font-medium",
    "hover:bg-primary/40 hover:text-base-content",
    isActive ? "bg-primary text-primary-content shadow-sm" : "text-base-content",
  ].join(" ");

const ddDanger =
  "block w-full text-left px-3 py-2 rounded-2xl transition font-medium hover:bg-primary/10 text-primary";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  // ✅ separate states (no conflict)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Esc to close menus
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsProfileOpen(false);
    setIsDrawerOpen(false);
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 transition bg-gradient",
        scrolled
          ? "bg-base-100/85 backdrop-blur border-b border-base-300"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-2xl grid place-items-center bg-primary/10">
            <span className="text-primary text-xl">🩸</span>
          </div> */}
          {/* from footer logo */}
          <div className="h-9 w-9 rounded-full grid place-items-center brand-grad">
            <span className="text-white">🩸</span>
          </div>
          <div className="leading-tight">
            <p className="font-extrabold text-lg">Blood<span className="text-primary">Bond</span></p>
            <p className="text-xs opacity-70 -mt-1">Donate • Save Lives</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About Us
          </NavLink>
          <NavLink to="/donation-requests" className={navClass}>
            Donation Requests
          </NavLink>
          <NavLink to="/find-blood" className={navClass}>
            Find Blood
          </NavLink>
          <NavLink to="/funding" className={navClass}>
            Funding
          </NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
          </button>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {!user?.email ? (
              <>
                <Link to="/login" className="btn-brand-outline">
                  Log In
                </Link>
                <Link to="/register" className="btn-brand">
                  Register Now
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-base-200 transition"
                >
                  <img
                    src={
                      user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-base-300"
                  />
                  <div className="text-left leading-tight">
                    <p className="text-sm font-bold text-primary max-w-[140px] truncate">
                      {user?.displayName || "Account"}
                    </p>
                    <p className="text-xs opacity-70 max-w-[140px] truncate">
                      {user?.email}
                    </p>
                  </div>
                </button>

                {/* ✅ Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    {/* click outside overlay */}
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                      aria-label="Close profile menu overlay"
                    />
                    <div className="absolute right-0 mt-2 w-64 z-50 rounded-3xl bg-base-100/95 backdrop-blur border border-base-300 shadow-xl p-2 ring-1 ring-black/5">
                      <NavLink
                        to="/dashboard"
                        className={ddClass}
                        onClick={() => setIsProfileOpen(false)}
                        end
                      >
                        Dashboard
                      </NavLink>

                      <NavLink
                        to="/dashboard/profile"
                        className={ddClass}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </NavLink>

                      <div className="my-2 h-px bg-base-200" />

                      <button onClick={handleLogout} className={ddDanger}>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="lg:hidden w-11 h-11 rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur grid place-items-center"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/25 z-40"
            aria-label="Close menu"
          />
          <aside className="fixed right-0 top-0 h-full w-[320px] max-w-[90vw] bg-base-100 z-50 border-l border-base-300 p-5">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-lg">Menu</p>
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
              </button>
              <button
                className="w-10 h-10 rounded-2xl hover:bg-base-200 grid place-items-center"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <NavLink
                onClick={() => setIsDrawerOpen(false)}
                to="/"
                className={navClass}
                end
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => setIsDrawerOpen(false)}
                to="/about"
                className={navClass}
              >
                About Us
              </NavLink>
              <NavLink
                onClick={() => setIsDrawerOpen(false)}
                to="/donation-requests"
                className={navClass}
              >
                Donation Requests
              </NavLink>
              <NavLink
                onClick={() => setIsDrawerOpen(false)}
                to="/find-blood"
                className={navClass}
              >
                Find Blood
              </NavLink>
              <NavLink
                onClick={() => setIsDrawerOpen(false)}
                to="/funding"
                className={navClass}
              >
                Funding
              </NavLink>

              <div className="h-px bg-base-300 my-3" />

              {!user?.email ? (
                <div className="flex flex-col gap-3">
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    to="/login"
                    className="btn-brand-outline"
                  >
                    Log In
                  </Link>
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    to="/register"
                    className="btn-brand"
                  >
                    Register Now
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    to="/dashboard"
                    className="btn-brand"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-brand-outline">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
