import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useCurrentUser from "../hooks/useCurrentUser";

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

export default function Funding() {
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  const location = useLocation();

  const [amount, setAmount] = useState(200);
  const [open, setOpen] = useState(false);

  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const name = currentUser?.name || user?.displayName || "User";
  const email = currentUser?.email || user?.email || "";

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const successFlag = params.get("success");
  const sessionId = params.get("session_id");
  const canceled = params.get("canceled");

  // ✅ guards for strict mode / double run
  const confirmRanRef = useRef(false);
  const payClickedRef = useRef(false);

  const fetchFundings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/fundings`, {
        headers: authHeader(),
      });
      setFundings(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load fundings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ confirm payment after redirect (RUN ONCE)
  useEffect(() => {
    const confirm = async () => {
      if (!successFlag || !sessionId) return;

      // strict mode double run protection
      if (confirmRanRef.current) return;
      confirmRanRef.current = true;

      setConfirmLoading(true);
      setError("");
      setSuccess("");

      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/fundings/confirm`,
          { sessionId },
          { headers: authHeader() }
        );

        setSuccess("Payment successful ✅ Funding saved!");
        await fetchFundings();

        // clean URL (remove query without reload)
        window.history.replaceState({}, "", window.location.pathname);
      } catch (err) {
        setError(err?.response?.data?.message || "Payment confirmation failed.");
      } finally {
        setConfirmLoading(false);
      }
    };

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successFlag, sessionId]);

  useEffect(() => {
    if (!canceled) return;

    setSuccess("");
    setError("Payment canceled.");
    window.history.replaceState({}, "", window.location.pathname);
  }, [canceled]);

  const startCheckout = async () => {
    // ✅ prevent double click
    if (payClickedRef.current) return;
    payClickedRef.current = true;

    const n = Number(amount);

    if (!n || n < 10) {
      setError("Minimum funding amount is 10.");
      payClickedRef.current = false;
      return;
    }

    setPayLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/create-checkout-session`,
        { amount: n, name, email },
        { headers: authHeader() }
      );

      const url = res.data?.url;
      if (!url) throw new Error("Checkout URL not received.");

      window.location.href = url;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Checkout failed.");
      payClickedRef.current = false; // allow retry
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="page-bg section-pad min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="card-soft p-6 md:p-8">
          <h1 className="text-4xl font-extrabold">
            Funding <span className="text-primary">Support</span>
          </h1>
          <p className="mt-3 opacity-80 max-w-2xl">
            Support our blood donation platform by contributing funds. Payments are handled securely via Stripe.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <button className=" btn-brand" onClick={() => setOpen(true)}>
              Give Fund
            </button>
            {confirmLoading && <span className="text-sm opacity-70">Confirming payment...</span>}
          </div>

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
        </div>

        <div className="mt-7 card-soft p-6 md:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold">
                Funding <span className="text-primary">History</span>
              </h2>
              <p className="mt-2 text-sm opacity-70">
                {(currentUser?.role === "admin" || currentUser?.role === "volunteer")
                  ? "Showing all fundings."
                  : "Showing your fundings only."}
              </p>
            </div>

            <button className="btn-inside-outline" onClick={fetchFundings} disabled={loading}>
              Refresh
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="table">
              <thead className="bg-accent/10">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-right">Amount</th>
                  <th>Currency</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center opacity-70">
                      Loading...
                    </td>
                  </tr>
                ) : fundings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center opacity-70">
                      No funding records found.
                    </td>
                  </tr>
                ) : (
                  fundings.map((f, idx) => (
                    <tr key={f._id}>
                      <td>{idx + 1}</td>
                      <td className="font-semibold">{f.name || "—"}</td>
                      <td className="text-sm opacity-80">{f.email || "—"}</td>
                      <td className="text-right font-extrabold">{formatMoney(f.amount, f.currency)}</td>
                      <td className="uppercase">{f.currency || "usd"}</td>
                      <td className="text-sm opacity-80">
                        {f.createdAt ? new Date(f.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md card-soft p-6">
            <h3 className="text-xl font-bold">Give Fund</h3>
            <p className="mt-2 text-sm opacity-70">
              Minimum amount is 10. You will be redirected to Stripe Checkout.
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-sm font-semibold">Amount</label>
                <input
                  type="number"
                  min="10"
                  className="input-brand mt-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="btn btn-brand-outline"
                    onClick={() => setAmount(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4 text-sm">
                <p>
                  <span className="opacity-70">Name:</span> <b>{name}</b>
                </p>
                <p className="truncate">
                  <span className="opacity-70">Email:</span> <b>{email}</b>
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="btn-inside-outline"
                onClick={() => setOpen(false)}
                disabled={payLoading}
              >
                Cancel
              </button>
              <button
                className=" btn-inside"
                onClick={startCheckout}
                disabled={payLoading}
              >
                {payLoading ? "Redirecting..." : "Pay with Stripe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMoney(amount, currency = "usd") {
  const num = Number(amount) || 0;
  const cur = (currency || "usd").toUpperCase();
  if (cur === "BDT") return `৳ ${num.toLocaleString("en-BD")}`;
  return `${cur} ${num.toLocaleString("en-US")}`;
}
