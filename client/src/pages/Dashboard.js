import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Tabs,
  message,
  notification,
  Switch,
  Space,
  Table
} from "antd";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AddRecordForm } from "../components/AddRecordForm";
import { jwtDecode } from "jwt-decode";
import PendingApproval from "../components/PendingApproval";
import { BASEURL } from "../constant/config";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0); // 15 mins
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [tokenForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification(); // We'll style this page
  const [tokenSaving, setTokenSaving] = useState(false);
  const [invoices, setInvoices] = useState([]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          handleLogout(); // auto logout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSessionTime(0);
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      setSessionTime(0);
      return;
    }

    const expiryTimeMs = decoded.exp * 1000;

    function updateSessionTime() {
      const now = Date.now();
      const diffSeconds = Math.floor((expiryTimeMs - now) / 1000);
      if (diffSeconds <= 0) {
        setSessionTime(0);
        handleLogout(); // your logout function
      } else {
        setSessionTime(diffSeconds);
      }
    }

    updateSessionTime(); // set initial

    const interval = setInterval(updateSessionTime, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function fetchSetupTokens() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASEURL}users/setup`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        tokenForm.setFieldsValue({
          sandboxToken: res.data.sandboxToken,
          productionToken: res.data.productionToken,
          useSandbox: res.data.useSandbox ?? true, // fallback
        });
      } catch (err) {
        console.error("Failed to load tokens", err);
      }
    }

    fetchSetupTokens();
  }, [tokenForm]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0 || d > 0) parts.push(`${h}h`);
    parts.push(`${m.toString().padStart(2, "0")}m`);
    parts.push(`${s.toString().padStart(2, "0")}s`);

    return parts.join(" ");
  };

  const handleAddRecord = async (values) => {
    setRecordLoading(true);
    try {
      await axios.post(`${BASEURL}records`, values); // change API
      api.success("Record added successfully!");
      setRecordModalOpen(false);
    } catch (err) {
      api.error("Failed to add record");
    } finally {
      setRecordLoading(false);
    }
  };

  const handleSaveTokens = async (values) => {
    setTokenSaving(true);

    const { sandboxToken, productionToken, useSandbox } = values;

    // ✅ Condition 1: At least one token must be provided
    if (!sandboxToken?.trim() && !productionToken?.trim()) {
      api.error({
        message: "Missing Tokens",
        description:
          "Please provide at least one token: Sandbox or Production.",
        placement: "topRight",
      });
      setTokenSaving(false);
      return;
    }

    // ✅ Condition 2: If Sandbox is off, Production token must be filled
    if (!useSandbox && !productionToken?.trim()) {
      api.error({
        message: "Production Token Required",
        description:
          "You must enter a Production Token before disabling Sandbox environment.",
        placement: "topRight",
      });
      setTokenSaving(false);
      return;
    }

    try {
      await axios.put(
        `${BASEURL}users/setup`,
        {
          sandboxToken,
          productionToken,
          useSandbox,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      api.success({
        message: "Tokens saved!",
        description: "Your API tokens have been updated successfully.",
        placement: "topRight",
      });
    } catch (err) {
      api.error({
        message: "Failed to Save",
        description:
          err?.response?.data?.message ||
          "An error occurred while saving tokens.",
        placement: "topRight",
      });
    } finally {
      setTokenSaving(false);
    }
  };

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASEURL}invoice/records`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoices(res.data); // Store the fetched invoices
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    }

    fetchInvoices();
  }, []);

  // Table columns configuration for invoices
  const columns = [
    {
      title: "Invoice No",
      dataIndex: "InvNo",
      key: "InvNo",
    },
    {
      title: "Invoice Date",
      dataIndex: "InvDate",
      key: "InvDate",
    },
    {
      title: "Customer Name",
      dataIndex: "CustName",
      key: "CustName",
    },
    {
      title: "Customer NTN",
      dataIndex: "CustNTN",
      key: "CustNTN",
    },
    {
      title: "Customer Status",
      dataIndex: "CustStatus",
      key: "CustStatus",
    },
    {
      title: "Customer Address",
      dataIndex: "CustAddress",
      key: "CustAddress",
    },
    {
      title: "Customer Province",
      dataIndex: "CustProvince",
      key: "CustProvince",
    },
    {
      title: "Sale Type",
      dataIndex: "SaleType",
      key: "SaleType",
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items.length,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button type="link" onClick={() => handleEdit(record)}>
    //         Edit
    //       </Button>
    //       <Button type="link" onClick={() => handleDelete(record)}>
    //         Delete
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  // Table nested columns for items in each invoice
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "HSCode",
        dataIndex: "HSCode",
        key: "HSCode",
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
      },
      {
        title: "UOM",
        dataIndex: "UOM",
        key: "UOM",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "SRO Schedule No",
        dataIndex: "sroScheduleNo",
        key: "sroScheduleNo",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.items}
        pagination={false}
        rowKey={(item) => item.sroScheduleNo}
      />
    );
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record);
  };

  const handleDelete = (record) => {
    console.log("Delete record:", record);
  };

  if (user?.status !== 'active') {
    return <PendingApproval onLogout={handleLogout} />;
  }
  return (
    <>
      {contextHolder}
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
            Welcome, {user?.name} — Session Expires In:{" "}
            {formatTime(sessionTime)}
          </div>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ padding: 24 }}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Dashboard" key="1">
              <Title level={3}>Welcome to Dashboard</Title>
              <p>Email: {user?.email}</p>

              <Button type="primary" onClick={() => setRecordModalOpen(true)}>
                Add Record
              </Button>

              <Title level={3}>Invoice Records</Title>
              <Table
                columns={columns}
                dataSource={invoices}
                rowKey="_id"
                expandable={{
                  expandedRowRender,
                  rowExpandable: (record) => record.items.length > 0,
                }}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab="Setup" key="2">
              <Form
                layout="vertical"
                form={tokenForm}
                initialValues={{
                  sandboxToken: user?.sandboxToken || "",
                  productionToken: user?.productionToken || "",
                  useSandbox: user?.useSandbox ?? true, // default true
                }}
                onFinish={handleSaveTokens}
                style={{ maxWidth: 400 }}
              >
                <Form.Item label="Sandbox Token" name="sandboxToken">
                  <Input placeholder="Enter sandbox token" />
                </Form.Item>

                <Form.Item label="Production Token" name="productionToken">
                  <Input placeholder="Enter production token" />
                </Form.Item>

                <Form.Item
                  label="Use Sandbox Environment"
                  name="useSandbox"
                  valuePropName="checked" // <-- required for Switch
                >
                  <Switch />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={tokenSaving}>
                  Save Tokens
                </Button>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Content>

        {/* Add Record Modal */}
        <Modal
          title="Add New Record"
          open={recordModalOpen}
          onCancel={() => setRecordModalOpen(false)}
          footer={null}
          width={1000}
          destroyOnClose
        >
          <AddRecordForm
            onSubmit={async (payload) => {
              setRecordLoading(true);
              const token = localStorage.getItem("token");
              try {
                const response = await axios.post(
                  `${BASEURL}invoice/records`,
                  payload,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                api.success({ message: "Record added successfully!" });
                if (!token) return;
        
                const res = await axios.get(`${BASEURL}invoice/records`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setInvoices(res.data); // Store the fetched invoices
                // ✅ Close modal and reset only on success
                setRecordModalOpen(false);
              } catch (err) {
                console.error(err);
                api.error({ message: "Failed to add record" });
              } finally {
                setRecordLoading(false);
              }
            }}
            setIsModalOpen={setRecordModalOpen}
          />
        </Modal>
      </Layout>
    </>
  );
};

export default Dashboard;
