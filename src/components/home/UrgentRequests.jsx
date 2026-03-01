import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";
import BrandButton from "../ui/BrandButton";

export default function UrgentRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/donation-requests/pending`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (mounted) setItems(data.slice(0, 6));
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load requests.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section-pad">
      <SectionTitle
        badge="🚑 Urgent"
        title="Latest pending"
        highlight="requests"
        subtitle="A quick glance at the most recent donation requests. You can view all requests anytime."
        actions={
          <>
            <BrandButton to="/donation-requests">View All Requests</BrandButton>
            <BrandButton variant="outline" to="/find-blood">
              Search Donors
            </BrandButton>
          </>
        }
      />

      <Container>
        {error ? (
          <div className="mt-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">{error}</div>
        ) : null}

        {loading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-soft p-6">
                <div className="h-5 w-40 bg-base-200 rounded-full" />
                <div className="mt-4 h-4 w-56 bg-base-200 rounded-full" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-14 bg-base-200 rounded-2xl" />
                  <div className="h-14 bg-base-200 rounded-2xl" />
                  <div className="h-14 bg-base-200 rounded-2xl" />
                  <div className="h-14 bg-base-200 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 card-soft p-10 text-center">
            <h3 className="text-xl font-extrabold">No pending requests right now.</h3>
            <p className="mt-2 text-sm opacity-80">Please check again later.</p>
            <div className="mt-6 flex justify-center gap-3">
              <BrandButton to="/">Go Home</BrandButton>
              <BrandButton variant="outline" to="/register">
                Join as Donor
              </BrandButton>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((r) => (
              <RequestMiniCard key={r._id} r={r} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function RequestMiniCard({ r }) {
  return (
    <div className="card-soft p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-primary">{r.recipientName}</h3>
          <p className="text-sm opacity-70 mt-1">
            {r.recipientDistrict}, {r.recipientUpazila}
          </p>
        </div>
        <span className="badge badge-dash">Pending</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Blood</p>
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
