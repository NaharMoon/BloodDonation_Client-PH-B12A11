// src/hooks/useRole.js
import useCurrentUser from "./useCurrentUser";

export const useRole = () => {
  const { currentUser, loading } = useCurrentUser();
  return {
    role: currentUser?.role || "donor",
    roleLoading: loading,
  };
};
