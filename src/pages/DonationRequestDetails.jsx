import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DonationRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [donorName, setDonorName] = useState(user?.displayName || "");

  const token = localStorage.getItem("access-token");

  const authHeader = useMemo(() => {
    return {
      authorization: `Bearer ${token}`,
    };
  }, [token]);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}`,
        { headers: authHeader }
      );
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load request details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const status = data?.status || "";
  const isPending = status === "pending";
  const isInprogress = status === "inprogress";
  const isDone = status === "done";
  const isCanceled = status === "canceled";

  // UI rule: show donate only if pending and user is logged in
  // (server will additionally ensure role=donor)
  const canTryDonate = !!user && isPending;

  const handleDonate = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}/donate`,
        { donorName: donorName || user?.displayName || "" },
        { headers: authHeader }
      );

      setSuccess("✅ Donation confirmed! Status updated to inprogress.");
      setOpen(false);
      await fetchDetails();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Donate failed. Make sure you are a donor and the request is pending."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Donation <span className="text-primary">Request Details</span>
            </h1>
            <p className="mt-2 text-sm opacity-70">
              View full request information and confirm donation if you are eligible.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/donation-requests" className="btn btn-brand-outline">
              Back to Requests
            </Link>
            <button onClick={() => navigate(-1)} className="btn btn-ghost">
              Go Back
            </button>
          </div>
        </div>

        {/* States */}
        {error && (
          <div className="mt-6 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 p-3 rounded-2xl bg-success/10 border border-success/20 text-success text-sm">
            {success}
          </div>
        )}

        {loading ? (
          <div className="mt-8 card-soft p-10 text-center opacity-70">
            Loading request details...
          </div>
        ) : !data ? (
          <div className="mt-8 card-soft p-10 text-center">
            <h3 className="text-xl font-bold">Request not found</h3>
            <p className="mt-2 text-sm opacity-70">
              The request may have been removed or you don't have permission to view it.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/donation-requests" className="btn btn-brand">
                Go to Requests
              </Link>
              <Link to="/" className="btn btn-brand-outline">
                Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Main content */}
            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              {/* Left: Details card */}
              <div className="lg:col-span-2 card-soft p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold">{data.recipientName}</h2>
                    <p className="text-sm opacity-70 mt-1">
                      {data.recipientDistrict}, {data.recipientUpazila}
                    </p>
                  </div>

                  <span className="badge badge-outline capitalize">
                    {data.status}
                  </span>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="opacity-70">Blood Group</p>
                    <p className="font-bold text-lg">{data.bloodGroup}</p>
                  </div>

                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="opacity-70">Hospital</p>
                    <p className="font-bold">{data.hospitalName}</p>
                  </div>

                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="opacity-70">Donation Date</p>
                    <p className="font-bold">{data.donationDate}</p>
                  </div>

                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="opacity-70">Donation Time</p>
                    <p className="font-bold">{data.donationTime}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold">Full Address</p>
                  <p className="mt-2 text-sm opacity-80">{data.fullAddress}</p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold">Request Message</p>
                  <p className="mt-2 text-sm opacity-80 whitespace-pre-line">
                    {data.requestMessage}
                  </p>
                </div>
              </div>

              {/* Right: Requester/Donor Info + Actions */}
              <div className="card-soft p-6">
                <h3 className="text-xl font-extrabold">People & Actions</h3>

                <div className="mt-4 rounded-2xl bg-base-200/60 p-4">
                  <p className="text-sm opacity-70">Requester</p>
                  <p className="font-bold">{data.requesterName || "N/A"}</p>
                  <p className="text-sm opacity-70">{data.requesterEmail}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-base-200/60 p-4">
                  <p className="text-sm opacity-70">Donor</p>
                  {data.donorEmail ? (
                    <>
                      <p className="font-bold">{data.donorName || "Donor"}</p>
                      <p className="text-sm opacity-70">{data.donorEmail}</p>
                    </>
                  ) : (
                    <p className="text-sm opacity-70">Not assigned yet</p>
                  )}
                </div>

                <div className="mt-6">
                  {/* Status hint */}
                  {isPending && (
                    <div className="p-3 rounded-2xl bg-warning/10 border border-warning/20 text-sm">
                      This request is <b>pending</b>. Eligible donors can confirm donation.
                    </div>
                  )}
                  {isInprogress && (
                    <div className="p-3 rounded-2xl bg-info/10 border border-info/20 text-sm">
                      Donation is currently <b>in progress</b>.
                    </div>
                  )}
                  {isDone && (
                    <div className="p-3 rounded-2xl bg-success/10 border border-success/20 text-sm">
                      Donation is <b>done</b>.
                    </div>
                  )}
                  {isCanceled && (
                    <div className="p-3 rounded-2xl bg-error/10 border border-error/20 text-sm">
                      This request was <b>canceled</b>.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    className="btn-inside w-full"
                    disabled={!canTryDonate || actionLoading}
                    onClick={() => {
                      setDonorName(user?.displayName || "");
                      setOpen(true);
                    }}
                    title={
                      !user
                        ? "Login required"
                        : !isPending
                        ? "Only pending requests can be donated"
                        : "Confirm donation"
                    }
                  >
                    {actionLoading ? "Please wait..." : "Donate / Confirm"}
                  </button>

                  <Link to="/donation-requests" className="btn-inside-outline w-full">
                    Explore More Requests
                  </Link>
                </div>

                {!user && (
                  <p className="mt-3 text-xs opacity-70">
                    You must be logged in to view details and donate.
                  </p>
                )}
              </div>
            </div>

            {/* Modal */}
            {open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => !actionLoading && setOpen(false)}
                />

                <div className="relative w-full max-w-md card-soft p-6">
                  <h3 className="text-xl font-extrabold">Confirm Donation</h3>
                  <p className="mt-2 text-sm opacity-70">
                    Confirm that you will donate blood for this request. After confirming,
                    status will be updated to <b>inprogress</b>.
                  </p>

                  <div className="mt-4">
                    <label className="text-sm font-semibold">Donor Name</label>
                    <input
                      className="input-brand mt-2"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mt-5 flex gap-3 justify-end">
                    <button
                      className="btn-inside-outline"
                      disabled={actionLoading}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-inside"
                      disabled={actionLoading}
                      onClick={handleDonate}
                    >
                      {actionLoading ? "Confirming..." : "Confirm"}
                    </button>
                  </div>

                  <p className="mt-3 text-xs opacity-70">
                    Note: Only donors can confirm (server will verify).
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}