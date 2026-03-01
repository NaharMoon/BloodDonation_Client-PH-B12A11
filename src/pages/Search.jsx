import { useMemo, useState } from "react";
import axios from "axios";
import { districts, upazillas } from "bd-geojs";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Search() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaName, setUpazilaName] = useState("");

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");

  const districtName = useMemo(() => {
    const d = districts.find((x) => String(x.id) === String(districtId));
    return d?.name || "";
  }, [districtId]);

  const filteredUpazilas = useMemo(() => {
    if (!districtId) return [];
    return upazillas.filter((u) => String(u.district_id) === String(districtId));
  }, [districtId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);
    setDonors([]);

    try {
      // build query
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (districtName) params.district = districtName;
      if (upazilaName) params.upazila = upazilaName;

      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/donors/search`, {
        params,
      });

      setDonors(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const resetUpazilaIfDistrictChanges = (newDistrictId) => {
    setDistrictId(newDistrictId);
    setUpazilaName("");
  };

  return (
    <div className="page-bg section-pad">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold">
            Search <span className="text-primary">Donors</span>
          </h1>
          <p className="mt-3 opacity-80">
            Select blood group and location to find active donors.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-7 card-soft p-6 md:p-8">
          <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold">Blood Group</label>
              <select
                className="select-brand mt-2"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
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

            <div>
              <label className="text-sm font-semibold">District</label>
              <select
                className="select-brand mt-2"
                value={districtId}
                onChange={(e) => resetUpazilaIfDistrictChanges(e.target.value)}
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

            <div>
              <label className="text-sm font-semibold">Upazila</label>
              <select
                className="select-brand mt-2"
                value={upazilaName}
                onChange={(e) => setUpazilaName(e.target.value)}
                disabled={!districtId}
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

            <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-2">
              <button className=" btn-brand" disabled={loading} type="submit">
                {loading ? "Searching..." : "Search"}
              </button>

              <button
                type="button"
                className="btn-inside-outline"
                onClick={() => {
                  setBloodGroup("");
                  setDistrictId("");
                  setUpazilaName("");
                  setDonors([]);
                  setSearched(false);
                  setError("");
                }}
              >
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-5 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-10">
          {!searched ? (
            <div className="card-soft p-10 text-center">
              <h3 className="text-xl font-bold">No results yet</h3>
              <p className="mt-2 text-sm opacity-70">
                Fill the form and press <b>Search</b> to show donors.
              </p>
            </div>
          ) : loading ? (
            <div className="card-soft p-10 text-center opacity-70">Searching...</div>
          ) : donors.length === 0 ? (
            <div className="card-soft p-10 text-center">
              <h3 className="text-xl font-bold">No donors found</h3>
              <p className="mt-2 text-sm opacity-70">
                Try another upazila/district or check later.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <h2 className="text-2xl font-extrabold">
                  Found <span className="text-primary">{donors.length}</span> donors
                </h2>
                <p className="text-sm opacity-70">
                  Showing active donors only.
                </p>
              </div>

              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {donors.map((d) => (
                  <DonorCard key={d._id || d.email} donor={d} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DonorCard({ donor }) {
  return (
    <div className="card-soft p-6 flex flex-col">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
          {donor.avatar ? (
            <img src={donor.avatar} alt={donor.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">🩸</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-extrabold truncate">{donor.name || "Donor"}</h3>
          <p className="text-xs opacity-70 truncate">{donor.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">Blood</p>
          <p className="font-bold">{donor.bloodGroup || "—"}</p>
        </div>

        <div className="rounded-2xl bg-base-200/60 p-3">
          <p className="opacity-70">District</p>
          <p className="font-bold truncate" title={donor.district || ""}>
            {donor.district || "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-base-200/60 p-3 col-span-2">
          <p className="opacity-70">Upazila</p>
          <p className="font-bold truncate" title={donor.upazila || ""}>
            {donor.upazila || "—"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <a
          className="btn-inside-outline"
          href={`mailto:${donor.email}?subject=Blood%20Donation%20Request&body=Hi%20${encodeURIComponent(
            donor.name || "Donor"
          )},%0D%0A%0D%0AI%20need%20blood%20donation%20support.%20Can%20you%20help%3F%0D%0A%0D%0AThanks`}
        >
          Contact
        </a>
      </div>
    </div>
  );
}
