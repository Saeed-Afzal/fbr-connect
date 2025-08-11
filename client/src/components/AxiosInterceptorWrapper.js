import React from "react";
import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

function AxiosInterceptorWrapper({ children }) {
  useAxiosInterceptor(); // Now useNavigate works because this is inside Router
  return <>{children}</>;
}

export default AxiosInterceptorWrapper;
