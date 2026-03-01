import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import useCurrentUser from "../../hooks/useCurrentUser";

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
    isActive ? "bg-primary text-primary-content btn-inside" : "hover:bg-base-200"
  }`;

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const { currentUser, loading } = useCurrentUser();
  const navigate = useNavigate();

  const role = useMemo(() => currentUser?.role, [currentUser]);
  const name = currentUser?.name || user?.displayName || "User";
  const email = currentUser?.email || user?.email || "";
  const avatar = currentUser?.avatar || user?.photoURL || "";

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    try {
      // ✅ clear token so protected calls don't act weird
      localStorage.removeItem("access-token");

      await logoutUser();
      close();
      navigate("/login");
    } catch (err) {
      console.log("logout error:", err);
    }
  };

  const content = (
    <div className="bg-base-200 border border-base-200 rounded-3xl p-5 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-base-300 flex items-center justify-center">
          🩸
        </div>
        <div className="leading-tight">
          <h3 className="font-bold">Blood<span className="text-primary">Bond</span></h3>
          <p className="text-xs opacity-70">Dashboard</p>
        </div>
      </div>

      {/* User Card */}
      <div className="mt-4 p-4 rounded-3xl bg-base-200/60 flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-base-100 overflow-hidden flex items-center justify-center">
          {avatar ? 
          (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">👤</span>
          )}
        </div>

        <div className="leading-tight min-w-0">
          <p className="font-semibold truncate">{loading ? "Loading..." : name}</p>
          <p className="text-xs opacity-70 truncate">{email}</p>
          <p className="text-xs opacity-70">Role: {loading ? "..." : role || "donor"}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-5 flex flex-col gap-2">
        {/* everyone */}
        <NavLink to="/dashboard" className={linkCls} onClick={close}>
          <span>🏠</span> Overview
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkCls} onClick={close}>
          <span>👤</span> Profile
        </NavLink>

        {/* ✅ role menus only after user loaded */}
        {!loading && role === "donor" && (
          <>
            <NavLink to="/dashboard/my-donation-requests" className={linkCls} onClick={close}>
              <span>🩸</span> My Requests
            </NavLink>

            <NavLink to="/dashboard/create-donation-request" className={linkCls} onClick={close}>
              <span>➕</span> Create Request
            </NavLink>
          </>
        )}

        {!loading && (role === "admin" || role === "volunteer") && (
          <NavLink to="/dashboard/all-blood-donation-request" className={linkCls} onClick={close}>
            <span>🧾</span> All Requests
          </NavLink>
        )}

        {!loading && role === "admin" && (
          <NavLink to="/dashboard/all-users" className={linkCls} onClick={close}>
            <span>👥</span> All Users
          </NavLink>
        )}

        {/* Funding (private route) */}
        <NavLink to="/funding" className={linkCls} onClick={close}>
          <span>💳</span> Funding
        </NavLink>
      </nav>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3">
        <Link to="/" className="btn-brand-outline-sm w-full" onClick={close}>
          ← Back to Site
        </Link>

        <button className=" btn-brand w-full" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">{content}</div>

      {/* Mobile: open button */}
      <div className="lg:hidden">
        <button className="btn btn-brand-outline w-full" onClick={() => setOpen(true)}>
          Open Dashboard Menu
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <aside className="absolute left-0 top-0 h-full w-[84%] max-w-sm p-4 overflow-y-auto">
            <div className="flex justify-end">
              <button className="btn btn-ghost btn-circle" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
