import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { districts, upazillas } from "bd-geojs";
import { useAuth } from "../../hooks/useAuth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

export default function EditDonationRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [request, setRequest] = useState(null);

  // controlled fields
  const [recipientName, setRecipientName] = useState("");
  const [recipientDistrict, setRecipientDistrict] = useState("");
  const [recipientUpazila, setRecipientUpazila] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // derive district id from name (bd-geojs list)
  const selectedDistrictId = useMemo(() => {
    const found = districts.find((d) => d.name === recipientDistrict);
    return found ? String(found.id) : "";
  }, [recipientDistrict]);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    return upazillas.filter(
      (u) => String(u.district_id) === String(selectedDistrictId)
    );
  }, [selectedDistrictId]);

  // fetch existing
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}`,
          { headers: authHeader() }
        );

        const data = res.data;

        // donor can edit only his own request (client-side guard)
        if (user?.email && data?.requesterEmail && user.email !== data.requesterEmail) {
          setError("You are not allowed to edit this request.");
          setRequest(data);
          setLoading(false);
          return;
        }

        setRequest(data);

        // set default values
        setRecipientName(data.recipientName || "");
        setRecipientDistrict(data.recipientDistrict || "");
        setRecipientUpazila(data.recipientUpazila || "");
        setHospitalName(data.hospitalName || "");
        setFullAddress(data.fullAddress || "");
        setBloodGroup(data.bloodGroup || "");
        setDonationDate(data.donationDate || "");
        setDonationTime(data.donationTime || "");
        setRequestMessage(data.requestMessage || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, user?.email]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!request) return;

    setSaving(true);
    setError("");

    const payload = {
      recipientName,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      fullAddress,
      bloodGroup,
      donationDate,
      donationTime,
      requestMessage,
    };

    try {
      /**
       * server implementation varies:
       * - some use PUT /donation-requests/:id
       * - some use PATCH /donation-requests/:id
       * so we try PATCH, fallback to PUT
       */
      try {
        await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}`,
          payload,
          { headers: authHeader() }
        );
      } catch (e1) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/donation-requests/${id}`,
          payload,
          { headers: authHeader() }
        );
      }

      navigate("/dashboard/my-donation-requests", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-4xl mx-auto card-soft p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              Edit <span className="text-primary">Donation Request</span>
            </h1>
            <p className="mt-2 text-sm opacity-70">
              Update recipient, location, schedule, and message.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/dashboard/my-donation-requests" className="btn btn-brand-outline">
              ← Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-5 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 p-10 text-center opacity-70">Loading...</div>
        ) : !request ? (
          <div className="mt-6 p-10 text-center opacity-70">Request not found.</div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 grid md:grid-cols-2 gap-4">
            {/* readonly requester info */}
            <div>
              <label className="text-sm font-semibold">Requester Name</label>
              <input
                value={request.requesterName || ""}
                readOnly
                className="input-brand mt-2 bg-base-200"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Requester Email</label>
              <input
                value={request.requesterEmail || ""}
                readOnly
                className="input-brand mt-2 bg-base-200"
              />
            </div>

            {/* recipient */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Recipient Name</label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                className="input-brand mt-2"
              />
            </div>

            {/* district */}
            <div>
              <label className="text-sm font-semibold">Recipient District</label>
              <select
                required
                className="select-brand mt-2"
                value={recipientDistrict}
                onChange={(e) => {
                  setRecipientDistrict(e.target.value);
                  setRecipientUpazila(""); // reset upazila
                }}
              >
                <option value="" disabled>
                  Select
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* upazila */}
            <div>
              <label className="text-sm font-semibold">Recipient Upazila</label>
              <select
                required
                className="select-brand mt-2"
                value={recipientUpazila}
                onChange={(e) => setRecipientUpazila(e.target.value)}
                disabled={!recipientDistrict}
              >
                <option value="" disabled>
                  Select
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Hospital Name</label>
              <input
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="input-brand mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Full Address</label>
              <input
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
                className="input-brand mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Blood Group</label>
              <select
                required
                className="select-brand mt-2"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Donation Date</label>
              <input
                type="date"
                required
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                className="input-brand mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Donation Time</label>
              <input
                type="time"
                required
                value={donationTime}
                onChange={(e) => setDonationTime(e.target.value)}
                className="input-brand mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Request Message</label>
              <textarea
                rows="4"
                required
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="textarea-brand mt-2"
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link to="/dashboard/my-donation-requests" className="btn btn-brand-outline">
                Cancel
              </Link>
              <button className="btn btn-brand" type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update Donation Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
