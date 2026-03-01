import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { districts, upazillas } from "bd-geojs";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateDonationRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // store district ID (not name) so we can filter upazilas correctly
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    return upazillas.filter(
      (u) => String(u.district_id) === String(selectedDistrictId)
    );
  }, [selectedDistrictId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;

    // recipientDistrict select now returns district ID
    const districtId = form.recipientDistrict.value;
    const districtObj = districts.find((d) => String(d.id) === String(districtId));
    const districtName = districtObj?.name || "";

    const data = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,

      recipientName: form.recipientName.value,
      recipientDistrict: districtName, // send name to backend (as before)
      recipientUpazila: form.recipientUpazila.value,

      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/donation-requests`,
        data,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );

      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-4xl mx-auto card-soft p-8">
        <h1 className="text-3xl font-bold mb-6">
          Create <span className="text-primary">Donation Request</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {/* requester info */}
          <div>
            <label className="text-sm font-semibold">Requester Name</label>
            <input
              value={user?.displayName || ""}
              readOnly
              className="input-brand mt-2 bg-base-200"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Requester Email</label>
            <input
              value={user?.email || ""}
              readOnly
              className="input-brand mt-2 bg-base-200"
            />
          </div>

          {/* recipient */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Recipient Name</label>
            <input name="recipientName" required className="input-brand mt-2" />
          </div>

          {/* district */}
          <div>
            <label className="text-sm font-semibold">Recipient District</label>
            <select
              name="recipientDistrict"
              required
              className="select-brand mt-2"
              value={selectedDistrictId}
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                setSelectedUpazila(""); // reset upazila when district changes
              }}
            >
              <option value="" disabled>
                Select
              </option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* upazila */}
          <div>
            <label className="text-sm font-semibold">Recipient Upazila</label>
            <select
              name="recipientUpazila"
              required
              className="select-brand mt-2"
              disabled={!selectedDistrictId || filteredUpazilas.length === 0}
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
            >
              <option value="" disabled>
                {selectedDistrictId ? "Select" : "Select District first"}
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
            <input name="hospitalName" required className="input-brand mt-2" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Full Address</label>
            <input name="fullAddress" required className="input-brand mt-2" />
          </div>

          <div>
            <label className="text-sm font-semibold">Blood Group</label>
            <select name="bloodGroup" required className="select-brand mt-2">
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
              name="donationDate"
              required
              className="input-brand mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Donation Time</label>
            <input
              type="time"
              name="donationTime"
              required
              className="input-brand mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Request Message</label>
            <textarea
              name="requestMessage"
              required
              rows="4"
              className="textarea-brand mt-2"
            />
          </div>

          {error && (
            <div className="md:col-span-2 text-sm text-error">{error}</div>
          )}

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="btn-brand w-full">
              {loading ? "Creating..." : "Request Blood"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}