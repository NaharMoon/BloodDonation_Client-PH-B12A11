import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosSecure from "./useAxiosSecure"; // path ঠিক করে নিও

const useCurrentUser = () => {
  const { user, loading } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access-token");

    // ✅ Auth loading থাকলে / token না থাকলে call করবে না
    if (loading || !user?.email || !token) {
      setDbLoading(false);
      return;
    }

    setDbLoading(true);

    axiosSecure
      .get("/users/me")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => {
        console.log("useCurrentUser error:", err?.response?.status, err);
        setCurrentUser(null);
      })
      .finally(() => setDbLoading(false));
  }, [user?.email, loading]);

  return { currentUser, loading: loading || dbLoading };
};

export default useCurrentUser;
