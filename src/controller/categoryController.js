import { API_URL } from "@/constants/apiConstantUrl";
import { axiosPrivate } from "@/lib/axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Post product controller
export const usePostCategoryController = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (payload) => {
      try {
        const res = await axiosPrivate.post(API_URL.CATEGORY_URL,payload,{
          headers: {
             "Content-Type": "application/json",
          },
        });
        return res.data; 
      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch Category";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["category"] });
      }
    },
    onError: (error) => {
    toast.error(error.message);
    },
    
  });
};


// Get all product controller
export const useGetAllcategory = () => {
  return useQuery({
    queryKey: ["category"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.CATEGORY_URL);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch category";
        throw new Error(message); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: 1, 
  });
};

// Get all product controller
export const useGetAllPublicCategory = () => {
  return useQuery({
    queryKey: ["category"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.PUBLIC_CATEGORY_URL);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch category";
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
export const useDeleteCategoryController = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosPrivate.delete(`${API_URL.CATEGORY_URL}${id}`);
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to delete category";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["category"] });

      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Update category controller
export const useUpdateCategoryController = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { id,payload } = data; 
      try {
        const res = await axiosPrivate.put(`${API_URL.CATEGORY_URL}${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to Update category";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["category"] });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
