import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PAGE_SIZE = 9;

export default function DonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/pending`
        );
        setRequests(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, page]);

  return (
    <div className="page-bg section-pad">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">
              Pending <span className="text-primary">Donation Requests</span>
            </h1>
            <p className="mt-3 opacity-80 max-w-2xl">
              This page shows only <b>pending</b> donation requests. Click{" "}
              <b>View</b> to see details (login required).
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/find-blood" className="btn-inside-outline">
              Search Donors
            </Link>
            <Link to="/register" className="btn-inside-outline">
              Join as Donor
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 card-soft p-10 text-center opacity-70">
            Loading pending requests...
          </div>
        ) : paginated.length === 0 ? (
          <div className="mt-10 card-soft p-10 text-center">
            <h3 className="text-xl font-bold">No pending requests found.</h3>
            <p className="mt-2 text-sm opacity-70">
              Please check again later.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/" className="btn btn-brand-outline">Go Home</Link>
              <Link to="/register" className="btn btn-brand">Register</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((r) => (
                <RequestCard key={r._id} r={r} />
              ))}
            </div>

            {/* Pagination */}
            {requests.length > PAGE_SIZE && (
              <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
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
          </>
        )}
      </div>
    </div>
  );
}

function RequestCard({ r }) {
  return (
    <div className="card-soft p-6 flex flex-col hover:scale-105 transition-all duration-1000">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-primary">{r.recipientName}</h3>
          <p className="text-sm opacity-70 mt-1">
            {r.recipientDistrict}, {r.recipientUpazila}
          </p>
        </div>

        <span className="badge badge-dash">Pending</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Blood Group</p>
          <p className="font-bold">{r.bloodGroup}</p>
        </div>
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Date</p>
          <p className="font-bold">{r.donationDate}</p>
        </div>
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Time</p>
          <p className="font-bold">{r.donationTime}</p>
        </div>
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Hospital</p>
          <p className="font-bold truncate" title={r.hospitalName}>
            {r.hospitalName}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs opacity-70 line-clamp-2">{r.requestMessage}</p>

        <Link to={`/donation-requests/${r._id}`} className="btn-inside">
          View
        </Link>
      </div>
    </div>
  );
}
