import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ek custom hook banao jahan interceptor setup ho
export function useAxiosInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = axios.interceptors.response.use(
      (response) => response, // agar response sahi hai toh wapas bhejo
      (error) => {
        if (error.response?.status === 403) {
          // status 403 = inactive user
          navigate("/pending");  // redirect to pending approval page
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [navigate]);
}
