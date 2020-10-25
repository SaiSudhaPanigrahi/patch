import React from "react";
import { Row, Col, Divider } from "antd";
import Map from "./Map";
import logo from "../assets/patch.png";
// List, Button, Skeleton
// import InfiniteScroll from "react-infinite-scroller";

const Home = () => (
  <Row className="container">
    <Col xs={16}>
      <Map />
    </Col>
    <Col xs={8}>
      <div className="infoCol">
        <Divider plain>
          <h1 className="title">
            <img src={logo} className="logo" alt="patch logo"/> Patch
          </h1>
        </Divider>
        <p>stuff here soon</p>
      </div>
    </Col>
  </Row>
);

export default Home;
