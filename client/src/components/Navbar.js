import React from "react";
import { Layout, Button, Space } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  return (
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
  );
};

export default Navbar;
