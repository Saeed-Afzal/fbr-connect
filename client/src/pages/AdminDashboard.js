// src/pages/AdminDashboard.js
import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Button,
  Typography,
  Table,
  Tabs,
  Space,
  Tag,
  message,
  Switch
} from "antd";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../constant/config";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASEURL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      message.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "pending" : "active";

      await axios.put(
        `${BASEURL}users/${userId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success(`User status updated to ${newStatus}`);
      fetchUsers(); // refresh
    } catch (err) {
      console.error("Failed to update status", err);
      message.error("Error updating user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={role === "admin" ? "gold" : "blue"}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Switch
            checked={record.status === "active"}
            onChange={() => toggleStatus(record._id, record.status)}
            checkedChildren="Active"
            unCheckedChildren="Pending"
          />
        ),
      },
  ];

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <div>
          Welcome Admin, {user?.name}
        </div>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Header>

      <Content style={{ padding: 24 }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Users" key="1">
            <Title level={3}>All Registered Users</Title>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              loading={loading}
            />
          </Tabs.TabPane>

          {/* Future tabs like Logs, Settings can be added here */}
        </Tabs>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
