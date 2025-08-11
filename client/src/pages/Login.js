import React, { useContext, useState } from "react";
import { Layout, Form, Input, Button, Typography, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASEURL } from "../constant/config";

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    height: "45px",
    borderRadius: "6px",
    borderColor: "#d9d9d9",
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASEURL}users/login`, values);
      login(res.data.user, res.data.token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ display: "flex" }}>
        
        {/* Left Image Side */}
        <div
          style={{
            flex: 1,
            backgroundImage: "url('https://images.unsplash.com/photo-1521790361543-f645cf042ec4')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Right Form Side */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <Title level={2}>Login</Title>
            <Text type="secondary">Welcome back! Please login to continue</Text>

            <Form layout="vertical" style={{ marginTop: "20px" }} onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input placeholder="example@mail.com" style={inputStyle} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password placeholder="********" style={inputStyle} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} style={inputStyle}>
                  Login
                </Button>
              </Form.Item>
            </Form>

            <Text>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
