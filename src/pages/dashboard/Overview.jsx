import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useCurrentUser from "../../hooks/useCurrentUser";

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

export default function Overview() {
  const { user } = useAuth();
  const { currentUser, loading: userLoading } = useCurrentUser();

  const role = currentUser?.role || "donor";
  const name = currentUser?.name || user?.displayName || "User";

  // donor recent requests
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // admin/volunteer stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [error, setError] = useState("");

  // Load donor recent 3 requests
  useEffect(() => {
    if (userLoading) return;
    if (role !== "donor") return;

    const loadRecent = async () => {
      setError("");
      setRecentLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/my`,
          { headers: authHeader() }
        );
        const all = res.data || [];
        setRecent(all.slice(0, 3));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load recent requests.");
      } finally {
        setRecentLoading(false);
      }
    };

    loadRecent();
  }, [role, userLoading]);

  // Load stats for admin/volunteer
  useEffect(() => {
    if (userLoading) return;
    if (!(role === "admin" || role === "volunteer")) return;

    const loadStats = async () => {
      setError("");
      setStatsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin-or-volunteer/stats`,
          { headers: authHeader() }
        );
        setStats(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load stats.");
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [role, userLoading]);

  const subtitle = useMemo(() => {
    if (role === "admin") return "Admin Dashboard Overview";
    if (role === "volunteer") return "Volunteer Dashboard Overview";
    return "Donor Dashboard Overview";
  }, [role]);

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="card-soft p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome, <span className="text-primary">{name}</span> 👋
          </h1>
          <p className="mt-2 opacity-75">{subtitle}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/dashboard/profile" className="btn-inside-outline">
              View Profile
            </Link>

            {role === "donor" && (
              <>
                <Link to="/dashboard/create-donation-request" className="btn-inside-outline">
                  + Create Request
                </Link>
                <Link to="/dashboard/my-donation-requests" className="btn-inside-outline">
                  My Requests
                </Link>
              </>
            )}

            {(role === "admin" || role === "volunteer") && (
              <Link to="/dashboard/all-blood-donation-request" className="btn-inside-outline">
                Manage Requests
              </Link>
            )}

            {role === "admin" && (
              <Link to="/dashboard/all-users" className="btn-inside-outline">
                Manage Users
              </Link>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {/* Donor view */}
        {role === "donor" && (
          <div className="mt-7 card-soft p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold">
                  Recent <span className="text-primary">Requests</span>
                </h2>
                <p className="mt-2 text-sm opacity-70">
                  Latest 3 requests from your account.
                </p>
              </div>

              <Link to="/dashboard/my-donation-requests" className="btn-inside-outline">
                View My All Requests
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="table">
                <thead className="bg-accent/10">
                  <tr>
                    <th>#</th>
                    <th>Recipient</th>
                    <th>Blood</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoading ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center opacity-70">
                        Loading...
                      </td>
                    </tr>
                  ) : recent.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center opacity-70">
                        No requests yet. Create your first request.
                      </td>
                    </tr>
                  ) : (
                    recent.map((r, idx) => (
                      <tr key={r._id}>
                        <td>{idx + 1}</td>
                        <td className="font-semibold">{r.recipientName}</td>
                        <td className="font-semibold">{r.bloodGroup}</td>
                        <td>{r.donationDate}</td>
                        <td>
                          <span className="badge badge-outline">{r.status}</span>
                        </td>
                        <td className="text-right">
                          <Link
                            className="btn btn-xs btn-ghost"
                            to={`/donation-requests/${r._id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin/Volunteer view */}
        {(role === "admin" || role === "volunteer") && (
          <div className="mt-7">
            <div className="grid md:grid-cols-3 gap-5">
              <StatCard
                title="Total Donors"
                value={statsLoading ? "..." : stats?.totalDonors ?? 0}
                hint="Active donors count"
              />
              <StatCard
                title="Total Funding"
                value={statsLoading ? "..." : formatBDT(stats?.totalFunding ?? 0)}
                hint="Sum of all donations"
              />
              <StatCard
                title="Total Requests"
                value={statsLoading ? "..." : stats?.totalRequests ?? 0}
                hint="All donation requests"
              />
            </div>

            <div className="mt-6 card-soft p-6 md:p-8">
              <h3 className="text-2xl font-extrabold">
                Quick <span className="text-primary">Actions</span>
              </h3>
              <p className="mt-2 text-sm opacity-70">
                Manage requests efficiently from the dashboard.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/dashboard/all-blood-donation-request" className="btn-inside-outline">
                  View All Requests
                </Link>
                {role === "admin" && (
                  <Link to="/dashboard/all-users" className="btn-inside-outline">
                    View All Users
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, hint }) {
  return (
    <div className="card-soft p-6">
      <p className="font-bold text-accent opacity-70">{title}</p>
      <h3 className="text-3xl font-extrabold mt-2 text-primary">{value}</h3>
      <p className="text-sm opacity-70 mt-2">{hint}</p>
    </div>
  );
}

function formatBDT(n) {
  const num = Number(n) || 0;
  return `৳ ${num.toLocaleString("en-BD")}`;
}
