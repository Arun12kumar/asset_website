import { useState, useCallback } from "react";
import { axiosPrivate } from "@/lib/axios";
import { API_URL } from "@/constants/apiConstantUrl";
import { toast } from "sonner";

// Correct Hook
export const useSearchAsset = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function MUST exist -> fixes: searchAssets is not a function
  const searchAssets = useCallback(async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosPrivate.get(
        `${API_URL.SEARCH_URL}?title=${encodeURIComponent(query)}`
      );

      setData(res.data?.data || []);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to search assets";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    searchAssets, // IMPORTANT
  };
};