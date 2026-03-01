import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { districts, upazillas } from "bd-geojs";
import { useAuth } from "../../hooks/useAuth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const authHeader = () => ({
  authorization: `Bearer ${localStorage.getItem("access-token")}`,
});

export default function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  // data from DB
  const [dbUser, setDbUser] = useState(null);

  // controlled fields
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaName, setUpazilaName] = useState("");

  const email = dbUser?.email || user?.email || "";

  const districtName = useMemo(() => {
    const d = districts.find((x) => String(x.id) === String(districtId));
    return d?.name || "";
  }, [districtId]);

  const filteredUpazilas = useMemo(() => {
    if (!districtId) return [];
    return upazillas.filter((u) => String(u.district_id) === String(districtId));
  }, [districtId]);

  // reverse: when DB has district name, find id
  const findDistrictIdByName = (name) => {
    const found = districts.find((d) => d.name === name);
    return found ? String(found.id) : "";
  };

  // fetch current user
  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
          headers: authHeader(),
        });

        const u = res.data;
        setDbUser(u);

        setName(u?.name || user?.displayName || "");
        setAvatar(u?.avatar || user?.photoURL || "");
        setBloodGroup(u?.bloodGroup || "");

        // db stores district as name, convert to id for selector
        const did = findDistrictIdByName(u?.district || "");
        setDistrictId(did);

        // upazila stored as name
        setUpazilaName(u?.upazila || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.email]);

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setIsEdit(true);
  };

  const handleCancel = () => {
    setSuccess("");
    setError("");
    setIsEdit(false);

    // reset to DB values
    if (!dbUser) return;
    setName(dbUser?.name || user?.displayName || "");
    setAvatar(dbUser?.avatar || user?.photoURL || "");
    setBloodGroup(dbUser?.bloodGroup || "");
    setDistrictId(findDistrictIdByName(dbUser?.district || ""));
    setUpazilaName(dbUser?.upazila || "");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/users`, {
        name,
        email,
        avatar,
        bloodGroup,
        district: districtName, // store name
        upazila: upazilaName,
        role: dbUser?.role || "donor",
        status: dbUser?.status || "active",
      });

      setSuccess("Profile updated successfully ✅");
      setIsEdit(false);

      // re-fetch /users/me (optional but safe)
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
        headers: authHeader(),
      });
      setDbUser(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-bg min-h-screen p-6">
      <div className="max-w-4xl mx-auto card-soft p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              My <span className="text-primary">Profile</span>
            </h1>
            <p className="mt-2 text-sm opacity-70">
              View and update your profile information.
            </p>
          </div>

          {!loading && (
            <div className="flex gap-3">
              {!isEdit ? (
                <button className=" btn-brand" onClick={handleEdit}>
                  Edit
                </button>
              ) : (
                <button className="btn-inside-outline" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          )}
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

        {loading ? (
          <div className="mt-8 p-10 text-center opacity-70">Loading...</div>
        ) : (
          <form onSubmit={handleSave} className="mt-7 grid md:grid-cols-2 gap-4">
            {/* avatar preview */}
            <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-3xl bg-base-200/60">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-base-100 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{name || "User"}</p>
                <p className="text-sm opacity-70 truncate">{email}</p>
                <p className="text-xs opacity-70">
                  Role: <b>{dbUser?.role || "donor"}</b> | Status:{" "}
                  <b>{dbUser?.status || "active"}</b>
                </p>
              </div>
            </div>

            {/* name */}
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input
                className="input-brand mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEdit}
                required
              />
            </div>

            {/* email always readonly */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                className="input-brand mt-2 bg-base-200"
                value={email}
                readOnly
              />
            </div>

            {/* avatar */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Avatar URL</label>
              <input
                className="input-brand mt-2"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                disabled={!isEdit}
                placeholder="Use imageBB URL (bonus later)"
              />
            </div>

            {/* blood group */}
            <div>
              <label className="text-sm font-semibold">Blood Group</label>
              <select
                className="select-brand mt-2"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                disabled={!isEdit}
                required
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

            {/* district */}
            <div>
              <label className="text-sm font-semibold">District</label>
              <select
                className="select-brand mt-2"
                value={districtId}
                onChange={(e) => {
                  setDistrictId(e.target.value);
                  setUpazilaName("");
                }}
                disabled={!isEdit}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.bn_name})
                  </option>
                ))}
              </select>
            </div>

            {/* upazila */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Upazila</label>
              <select
                className="select-brand mt-2"
                value={upazilaName}
                onChange={(e) => setUpazilaName(e.target.value)}
                disabled={!isEdit || !districtId}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.bn_name})
                  </option>
                ))}
              </select>
            </div>

            {/* save button */}
            {isEdit && (
              <div className="md:col-span-2 flex justify-end">
                <button className="btn-inside" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
