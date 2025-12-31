import { API_URL } from "@/constants/apiConstantUrl";
import { axiosPrivate } from "@/lib/axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Post product controller
export const usePostSubCategoryController = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (payload) => {
      try {
        const res = await axiosPrivate.post(API_URL.SUBCATEGORY,payload,{
          headers: {
             "Content-Type": "application/json",
          },
        });
        return res.data; 
      } catch (err) {
      
        const message = err.response?.data?.error || err.message || "Failed to fetch subCategory";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["subcategory"] });
      }
    },
    onError: (error) => {
    toast.error(error.message);
    },
    
  });
};


// Get all product controller
export const useGetAllsubcategory = () => {
  return useQuery({
    queryKey: ["subcategory"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.SUBCATEGORY);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch subCategory";
        throw new Error(message); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: 1, 
  });
};


export const useGetsubcategoryUsingCategory = (categoryId) => {
  return useQuery({
    queryKey: ["subcategory", categoryId], // store ID in queryKey
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1]; // extract ID

      try {
        const res = await axiosPrivate.get(`${API_URL.SUBCATEGORY_CATGORY}${id}`);
        return res.data?.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Failed to fetch subCategory";
        throw new Error(message);
      }
    },
    enabled: !!categoryId, // prevents auto-run until id exists
    retry: 1,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Delete product controller
export const useDeletesubcategoryController = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosPrivate.delete(`${API_URL.SUBCATEGORY}${id}`);
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to delete subcategory";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["subcategory"] });

      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// Update subcategory controller
export const useUpdateSubCategoryController = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { id,payload } = data; 
      try {
        const res = await axiosPrivate.put(`${API_URL.SUBCATEGORY}${id}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to Update subcategory";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["subcategory"] });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
