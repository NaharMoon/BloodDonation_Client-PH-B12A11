import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

const FILTERS = ["all", "pending", "inprogress", "done", "canceled"];
const STATUS_OPTIONS = ["pending", "inprogress", "done", "canceled"];

export default function AllRequests() {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const role = currentUser?.role || "donor";
  const isAdmin = role === "admin";

  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState([]);

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

  useEffect(() => {
    if (userLoading) return;

    const load = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin-or-volunteer/requests${queryString}`,
          { headers: authHeader() }
        );
        setRequests(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryString, refetchKey, userLoading]);

  const updateStatus = async (id, nextStatus) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}/status`,
        { status: nextStatus },
        { headers: authHeader() }
      );
      setSuccess("Status updated ✅");
      refetch();
    } catch (err) {
      setError(err?.response?.data?.message || "Status update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}`,
        { headers: authHeader() }
      );
      setSuccess("Request deleted ✅");
      refetch();
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto card-soft p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              All <span className="text-primary">Blood Donation Requests</span>
            </h1>
            <p className="mt-2 text-sm opacity-70">
              {isAdmin
                ? "Admin can manage requests and update status."
                : "Volunteer can update request status only."}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              className="select-brand"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loading}
            >
              {FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f === "all" ? "All Status" : f}
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
          <table className="table">
            <thead className="bg-accent/10">
              <tr>
                <th>#</th>
                <th>Recipient</th>
                <th>Location</th>
                <th>Blood</th>
                <th>Date</th>
                <th>Status</th>
                <th>Donor</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center opacity-70">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center opacity-70">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r, idx) => (
                  <tr key={r._id}>
                    <td>{idx + 1}</td>
                    <td className="font-semibold">{r.recipientName}</td>
                    <td className="text-sm opacity-80">
                      {r.recipientDistrict}, {r.recipientUpazila}
                    </td>
                    <td className="font-semibold">{r.bloodGroup}</td>
                    <td>{r.donationDate}</td>
                    <td>
                      <span className="badge badge-outline">{r.status}</span>
                    </td>
                    <td className="text-sm">
                      {r.donorEmail ? (
                        <div>
                          <p className="font-semibold">{r.donorName || "Donor"}</p>
                          <p className="opacity-70">{r.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="opacity-70">—</span>
                      )}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Link
                          className="btn btn-xs btn-ghost"
                          to={`/donation-requests/${r._id}`}
                        >
                          View
                        </Link>

                        {/* status change */}
                        <select
                          className="select select-xs"
                          value={r.status}
                          disabled={actionLoading}
                          onChange={(e) => updateStatus(r._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {/* Admin only delete (optional) */}
                        {isAdmin && (
                          <button
                            className="btn btn-xs btn-ghost text-error"
                            disabled={actionLoading}
                            onClick={() => deleteRequest(r._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs opacity-60">
          Volunteer can update status only. Admin can do extra actions.
        </p>
      </div>
    </div>
  );
}
