// src/controllers/authController.js
import {  useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { axiosPublic,axiosPrivate } from "@/lib/axios";
import { API_URL } from "@/constants/apiConstantUrl";
import { toast } from "sonner";


export const  useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      try {
      
        const res = await axiosPublic.post(API_URL.ADMINLOGIN_URL, credentials, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data; // { success, user, message }

      } catch (err) {
      
        const message =
          err.response?.data?.message || err.message || "Failed to Login";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["auth"], data.user); // cache user
      }
    },
  });
};

// ✅ Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosPublic.post(API_URL.ADMINLOGOUT_URL);
      return res.data;
    },
    onSuccess: () => {
      queryClient.removeQueries(["auth"]);
    },
  });
};


// Get all product controller
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"], // cache key
    queryFn: async () => {
      try {
        const res = await axiosPrivate.get(API_URL.GETALLUSERS);
        return res.data?.data;

      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch users";
        throw new Error(message); 
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    retry: 1, 
  });
};

// Post product controller
export const usePostUserController = () => {
  const queryClient = useQueryClient();
  return useMutation({

    mutationFn: async (payload) => {
      try {
        const res = await axiosPrivate.post(API_URL.CREATEUSERS,payload,{
          headers: {
             "Content-Type": "application/json",
          },
        });
        return res.data; 
      } catch (err) {
      
        const message = err.response?.data?.message || err.message || "Failed to fetch Users";
        throw new Error(message); 
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error) => {
    toast.error(error.message);
    },
    
  });
};


export const useSendEmailOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post(API_URL.SENDEMAIL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("OTP sent successfully!");
        queryClient.invalidateQueries({ queryKey: ["otp"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });
};


export const useOtpVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await axiosPublic.post(API_URL.OTPVERIFY, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Password reset successful!");
        queryClient.invalidateQueries({ queryKey: ["otp"] }); // optional
      }
    },
    onError: (error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });
};

export const useOtpVerifyExpireTime = (email) => {
  return useQuery({
    queryKey: ["otp-expire-time", email],
    queryFn: async () => {
      if (!email) return null;
      const res = await axiosPublic.get(
        `${API_URL.OTPVERIFY_EXPIRETIME}?email=${email}`
      );
      return res.data;
    },
    enabled: !!email, // only run when email is available
    onError: (error) => {
      toast.error(error.message || "Failed to fetch OTP expiry time");
    },
  });
};

// Delete product controller
export const useDeleteUserController = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosPrivate.delete(`${API_URL.DELETEUSERS}${id}`);
        return res.data; // Return the full response
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to delete user";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the products query
        queryClient.invalidateQueries({ queryKey: ["users"] });

      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};