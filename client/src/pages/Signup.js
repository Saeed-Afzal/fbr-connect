// Signup.jsx
import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, message, Spin } from "antd";
import { useNavigate,Link  } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    height: "45px",
    borderRadius: "6px",
    borderColor: "#d9d9d9", // lighter border
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await axios.post("http://172.16.0.69:8003/users/register", values); // 🔹 API endpoint
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ display: "flex" }}>
        
        {/* Left Image Side */}
        <div style={{
          flex: 1,
          backgroundImage: "url('https://images.unsplash.com/photo-1521790361543-f645cf042ec4')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}></div>

        {/* Right Form Side */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px"
        }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <Title level={2}>Create Account</Title>
            <Text type="secondary">Please fill the form to register</Text>

            <Form
              layout="vertical"
              style={{ marginTop: "20px" }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="John Doe"  style={inputStyle}/>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email" }
                ]}
              >
                <Input placeholder="example@mail.com"  style={inputStyle}/>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password placeholder="********"  style={inputStyle}/>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={inputStyle}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
            <Text>
              Already have an account? <Link to="/login">Login</Link>
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Signup;
