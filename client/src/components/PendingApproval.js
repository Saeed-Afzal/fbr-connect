import { Result, Button } from "antd";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const PendingApproval = ({ onLogout }) => {
  const { user, logout, setUser } = useContext(AuthContext); // assuming setUser is available to update user in context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    async function checkStatus() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://172.16.0.69:8003/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // assuming res.data has user object with status
        console.log(res, 'res');
        
        if (res.data.status === "active") {
            console.log('true');
            
          setUser(res.data); // update user context
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Error checking user status:", err);
      }
    }

    checkStatus();
  }, [navigate, setUser]);

  return (
    <Result
      status="403"
      title="Your account is pending approval"
      subTitle="Please wait until an admin approves your account. You’ll be notified once it's activated."
      extra={
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      }
    />
  );
};

export default PendingApproval;
