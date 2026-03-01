import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const STATUSES = ["all", "pending", "inprogress", "done", "canceled"];
const PAGE_SIZE = 8;

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

export default function MyRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch
  useEffect(() => {
    if (!user?.email) return;

    const load = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/my?email=${user.email}`,
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
  }, [user?.email, refetchKey]);

  // filter
  const filtered = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    // filter change হলে page reset
    setPage(1);
  }, [statusFilter]);

  const refetch = () => setRefetchKey((k) => k + 1);

  const updateStatus = async (id, nextStatus) => {
    try {
      setActionLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}/status`,
        { status: nextStatus },
        { headers: authHeader() }
      );
      refetch();
    } catch (err) {
      setError(err?.response?.data?.message || "Status update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${deleteId}`,
        { headers: authHeader() }
      );
      setDeleteId(null);
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
              My <span className="text-primary">Donation Requests</span>
            </h1>
            <p className="mt-2 opacity-70 text-sm">
              View, filter, and manage your donation requests.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <select
              className="select-brand"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Status" : s}
                </option>
              ))}
            </select>

            <Link to="/dashboard/create-donation-request" className="btn btn-brand">
              + Create Request
            </Link>
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mt-5 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
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
                <th>Date</th>
                <th>Time</th>
                <th>Blood</th>
                <th>Status</th>
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
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center opacity-70">
                    No requests found.
                  </td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr key={r._id}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="font-semibold">{r.recipientName}</td>
                    <td className="text-sm opacity-80">
                      {r.recipientDistrict}, {r.recipientUpazila}
                    </td>
                    <td>{r.donationDate}</td>
                    <td>{r.donationTime}</td>
                    <td className="font-semibold">{r.bloodGroup}</td>
                    <td>
                      <span className="badge badge-outline">
                        {r.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-end gap-2 flex-wrap">
                        {/* Status update buttons only when inprogress */}
                        {r.status === "inprogress" && (
                          <>
                            <button
                              className="btn btn-xs btn-brand"
                              disabled={actionLoading}
                              onClick={() => updateStatus(r._id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-xs btn-brand-outline"
                              disabled={actionLoading}
                              onClick={() => updateStatus(r._id, "canceled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        <Link
                          className="btn btn-xs btn-ghost"
                          to={`/donation-requests/${r._id}`}
                        >
                          View
                        </Link>

                        <Link
                          className="btn btn-xs btn-ghost"
                          to={`/dashboard/edit-request/${r._id}`}
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-xs btn-ghost text-error"
                          onClick={() => setDeleteId(r._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            <button
              className="btn btn-sm btn-ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const active = p === page;
                return (
                  <button
                    key={p}
                    className={`btn btn-sm ${active ? "btn-brand" : "btn-ghost"}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-sm btn-ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative w-full max-w-md card-soft p-6">
            <h3 className="text-xl font-bold">Delete Request?</h3>
            <p className="mt-2 opacity-75 text-sm">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                className="btn btn-brand-outline"
                onClick={() => setDeleteId(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-brand"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
