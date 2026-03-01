import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { districts, upazillas } from "bd-geojs";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Keep district id for filtering upazilas
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  // ✅ Keep district/upazila NAME for saving in DB
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedUpazilaName, setSelectedUpazilaName] = useState("");

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
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const avatarUrl = form.avatarUrl.value.trim();
    const bloodGroup = form.bloodGroup.value;

    // ✅ Save name, not id
    const district = selectedDistrictName;
    const upazila = selectedUpazilaName;

    const password = form.password.value;
    const confirm = form.confirm.value;

    if (password !== confirm) {
      setLoading(false);
      return setError("Password and Confirm Password do not match.");
    }
    if (password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters.");
    }
    if (!district || !upazila) {
      setLoading(false);
      return setError("Please select both district and upazila.");
    }

    try {
      const res = await registerUser(email, password);

      if (res?.user) {
        await updateUserProfile(name, avatarUrl);
      }

      await axios.put(`${import.meta.env.VITE_SERVER_URL}/users`, {
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district, // ✅ name
        upazila,  // ✅ name
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-[85vh] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-3xl card-soft p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Register as <span className="text-primary">Donor</span>
        </h1>
        <p className="mt-2 opacity-75">
          Create your donor account (district/upazila + blood group required).
        </p>

        <form onSubmit={handleSubmit} className="mt-7 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Full Name</label>
            <input name="name" required placeholder="Your full name" className="input-brand mt-2" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Avatar URL</label>
            <input
              name="avatarUrl"
              placeholder="Temporary URL. Next step: imageBB upload."
              className="input-brand mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter email"
              className="input-brand mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Blood Group</label>
            <select name="bloodGroup" required className="select-brand mt-2">
              <option value="" disabled>Select</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">District</label>
            <select
              required
              className="select-brand mt-2"
              value={selectedDistrictId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedDistrictId(id);

                const d = districts.find((x) => String(x.id) === String(id));
                setSelectedDistrictName(d?.name || "");

                // reset upazila
                setSelectedUpazilaName("");
              }}
            >
              <option value="" disabled>Select</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.bn_name})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Upazila</label>
            <select
              required
              className="select-brand mt-2"
              disabled={!selectedDistrictId}
              value={selectedUpazilaName}
              onChange={(e) => setSelectedUpazilaName(e.target.value)}
            >
              <option value="" disabled>
                {selectedDistrictId ? "Select" : "Select district first"}
              </option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.bn_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input name="password" type="password" required placeholder="Password" className="input-brand mt-2" />
          </div>

          <div>
            <label className="text-sm font-semibold">Confirm Password</label>
            <input name="confirm" type="password" required placeholder="Confirm password" className="input-brand mt-2" />
          </div>

          {error && (
            <div className="md:col-span-2">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="md:col-span-2 mt-2 flex items-center gap-3">
            <button disabled={loading} className="btn btn-primary">
              {loading ? "Creating..." : "Register"}
            </button>

            <p className="text-sm opacity-80">
              Already have an account?{" "}
              <Link className="link link-primary" to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}