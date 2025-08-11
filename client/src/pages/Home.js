import React from "react";
import { Layout, Menu, Button, Space } from "antd";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;

const Home = () => {
  return (
    <Layout>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
          MyApp
        </div>
        <Space>
          <Link to="/login">
            <Button type="primary">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Signup</Button>
          </Link>
        </Space>
      </Header>
      <Content style={{ padding: "50px", textAlign: "center" }}>
        <h1>Welcome to MyApp</h1>
        <p>Please login or signup to continue.</p>
      </Content>
    </Layout>
  );
};

export default Home;
