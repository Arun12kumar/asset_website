import axios from "axios";
const API_BASE_URL = "https://asset-backend-slqs.onrender.com/api";

// Public axios (for login/register)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // very important for sending cookies
});

// Private axios (for protected routes)
export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});