// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import auth from "../firebase/firebase.auth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtLoading, setJwtLoading] = useState(true);

  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const updateUserProfile = async (displayName, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const logoutUser = async () => {
    localStorage.removeItem("access-token");
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser?.email) {
        localStorage.removeItem("access-token");
        setJwtLoading(false);
        return;
      }

      try {
        setJwtLoading(true);

        // ✅ Minimal upsert (only identity). role/status server controlled.
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/users`, {
          name: currentUser.displayName || "",
          email: currentUser.email,
          avatar: currentUser.photoURL || "",
        });

        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/jwt`, {
          email: currentUser.email,
        });

        localStorage.setItem("access-token", res.data.token);
      } catch (err) {
        console.log("JWT error:", err?.response?.data || err.message);
        localStorage.removeItem("access-token");
      } finally {
        setJwtLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    jwtLoading,
    registerUser,
    loginUser,
    updateUserProfile,
    logoutUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
