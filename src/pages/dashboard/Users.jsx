import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Blocked", value: "blocked" },
];

const ROLES = ["donor", "volunteer", "admin"];

export default function Users() {
  const [statusFilter, setStatusFilter] = useState("all");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [refetchKey, setRefetchKey] = useState(0);

  const queryString = useMemo(() => {
    if (statusFilter === "all") return "";
    return `?status=${statusFilter}`;
  }, [statusFilter]);

  const refetch = () => setRefetchKey((k) => k + 1);

  // fetch users
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/users${queryString}`,
          { headers: authHeader() }
        );
        setUsers(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryString, refetchKey]);

  const updateUser = async (id, payload) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/admin/users/${id}`,
        payload,
        { headers: authHeader() }
      );
      setSuccess("Updated successfully ✅");
      refetch();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBlock = async (u) => {
    const nextStatus = u.status === "blocked" ? "active" : "blocked";
    await updateUser(u._id, { status: nextStatus });
  };

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto card-soft p-6 md:p-8 ">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              All <span className="text-primary">Users</span>
            </h1>
            <p className="mt-2 text-sm opacity-70">
              Admin can manage user roles and block/unblock users.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              className="select-brand"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loading}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              className="btn-inside-outline"
              onClick={refetch}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* alerts */}
        {error && (
          <div className="mt-5 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm">
            {success}
          </div>
        )}

        {/* table */}
        <div className="mt-6 overflow-x-auto">
          <table className="table rounded-2xl">
            <thead className="bg-accent/10">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Blood</th>
                <th>Location</th>
                <th>Status</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center opacity-70">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center opacity-70">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <UserRow
                    key={u._id}
                    idx={idx}
                    user={u}
                    actionLoading={actionLoading}
                    onRoleChange={(role) => updateUser(u._id, { role })}
                    onToggleBlock={() => toggleBlock(u)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs opacity-60">
          Note: Blocked users cannot create donation requests and cannot receive JWT.
        </p>
      </div>
    </div>
  );
}

function UserRow({ idx, user, actionLoading, onRoleChange, onToggleBlock }) {
  const avatar = user.avatar || "";

  return (
    <tr>
      <td>{idx + 1}</td>

      <td>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-semibold truncate">{user.name || "—"}</p>
            <p className="text-xs opacity-70 truncate">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="font-semibold">{user.bloodGroup || "—"}</td>

      <td className="text-sm opacity-80">
        {user.district ? `${user.district}, ${user.upazila || ""}` : "—"}
      </td>

      <td>
        <span className="badge badge-outline">{user.status || "active"}</span>
      </td>

      <td>
        <select
          className="select select-sm"
          value={user.role || "donor"}
          onChange={(e) => onRoleChange(e.target.value)}
          disabled={actionLoading}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>

      <td className="text-right">
        <button
          className={`btn btn-xs ${user.status === "blocked" ? "btn-brand" : "btn-brand-outline"}`}
          onClick={onToggleBlock}
          disabled={actionLoading}
        >
          {user.status === "blocked" ? "Unblock" : "Block"}
        </button>
      </td>
    </tr>
  );
}
