"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin, useLogout } from "@/controller/authController";
import { axiosPublic, axiosPrivate } from "@/lib/axios";
import { API_URL } from "@/constants/apiConstantUrl";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [auth, setAuth] = useState(null); // user info

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Axios interceptor
  useEffect(() => {
    const interceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) → try refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await axiosPublic.post(API_URL.REFRESH_URL);
            return axiosPrivate(originalRequest); // retry original request
          } catch (err) {
            // Refresh failed, but do NOT redirect (optional: just clear auth)
            setAuth(null);
            queryClient.removeQueries(["auth"]);
            return Promise.reject(err);
          }
        }

        // Handle 403 (Forbidden) → logout and navigate to login
        if (error.response?.status === 403) {
          handleAutoLogout();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => axiosPrivate.interceptors.response.eject(interceptor);
  }, [queryClient]);

  // Verify session on page load
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const res = await axiosPrivate.get(API_URL.PROFILE_URL);
        setAuth(res.data?.user);
        queryClient.setQueryData(["auth"], res.data?.user);
      } catch (err) {
        if (err.response?.status === 403) {
          handleAutoLogout();
        } else {
          // For 401 or other errors, just clear auth state
          setAuth(null);
          queryClient.removeQueries(["auth"]);
        }
      }
    };
    verifyLogin();
  }, [queryClient]);

  // Helper: Auto logout and redirect to login
  const handleAutoLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      console.error("Logout error:", e.message);
    } finally {
      setAuth(null);
      queryClient.removeQueries(["auth"]);
      router.push("/admin/login"); // smooth redirect
    }
  };

  // Login
  const login = async (credentials) => {
    const data = await loginMutation.mutateAsync(credentials);
    if (data?.user) {
      setAuth(data.user);
      queryClient.setQueryData(["auth"], data.user);
    }
    return data;
  };

  // Manual logout
  const logout = async () => {
    await handleAutoLogout();
  };

  const value = {
    auth,
    login,
    logout,
    isLoggingIn: loginMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};