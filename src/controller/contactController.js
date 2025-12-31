import { API_URL } from "@/constants/apiConstantUrl";
import { axiosPrivate } from "@/lib/axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Post product controller


export const usePostContactController = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (payload) => {
      try {
        const res = await axiosPrivate.post(API_URL.CONTACT_URL,payload,{
          headers: {
             "Content-Type": "application/json",
          },
        });
        return res.data; 
      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch contact";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["enquire"] });
      }
    },
    onError: (error) => {
    toast.error(error.message);
    },
    
  });
};


// Get all product controller
export const useGetAllContact = () => {
  return useQuery({
    queryKey: ["contact"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.CONTACT_URL);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch contact";
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
export const useDeleteContactController = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosPrivate.delete(`${API_URL.CONTACT_URL}${id}`);
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to delete contact";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["contact"] });

      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
