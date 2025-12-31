import { API_URL } from "@/constants/apiConstantUrl";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Post product controller
export const usePostAssetController = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (payload) => {
      try {
        const res = await axiosPrivate.post(API_URL.ASSET_URL,payload,{
          headers: {
             "Content-Type": "multipart/form-data",
          },
        });
        return res.data; 
      } catch (err) {
      
        const message = err.response?.data?.error || err.response?.data?.message || "Failed to fetch asset";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["asset"] });
      }
    },
    onError: (error) => {
    toast.error(error.message);
    },
    
  });
};


// Get all product controller
export const useGetAllAsset = () => {
  return useQuery({
    queryKey: ["asset"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.ASSET_URL);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.error || err.response?.data?.message || "Failed to fetch asset";
        throw new Error(message); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: 1, 
  });
};

// Get asset using slug controller
export const useGetAssetBySlug = (slug) => {
  return useQuery({
    queryKey: ["asset", slug],  // store slug in key
    queryFn: async ({ queryKey }) => {
      const [, slugValue] = queryKey; // extract slug

      if (!slugValue) throw new Error("Invalid asset slug");

      try {
        const res = await axiosPublic.get(`${API_URL.ASSET_URL}${slugValue}`);
        return res.data?.data;
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch asset";

        throw new Error(message);
      }
    },
    enabled: !!slug, // don't run unless slug exists
    retry: 1,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Get all product controller
export const useGetAllAssetinCard = () => {
  return useQuery({
    queryKey: ["asset"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(API_URL.ASSETCARD_URL);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.error || err.response?.data?.message || "Failed to fetch asset";
        throw new Error(message); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: 1, 
  });
};

// Delete product controller
export const useDeleteAssetController = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosPrivate.delete(`${API_URL.ASSET_URL}${id}`);
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.error || err.response?.data?.message || "Failed to delete asset";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["asset"] });

      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Update subcategory controller
export const useUpdateAssetController = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { id,payload } = data; 
      try {
        const res = await axiosPrivate.put(`${API_URL.ASSET_URL}${id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.error || err.response?.data?.message || "Failed to Update asset";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["asset"] });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
