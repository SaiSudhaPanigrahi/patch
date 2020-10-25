import React from "react";
import { Row, Col, Divider } from "antd";
import Map from "./Map";
import { Link } from "react-router-dom";
import logo from "../assets/patch.png";

const ErrorPage = () => (
  <Row className="container">
    <Col xs={16}>
      <Map />
    </Col>
    <Col xs={8}>
      <div className="infoCol">
        <Divider plain>
          <h1 className="title">
            <Link to="/">
              <img src={logo} className="logo" alt="patch logo"/> Patch
            </Link>
          </h1>
        </Divider>
        <p>404 not found!</p>
        <p className="footer"><a href="https://marcusfran.co">Marcus Franco</a></p>
      </div>
    </Col>
  </Row>
);

export default ErrorPage;
