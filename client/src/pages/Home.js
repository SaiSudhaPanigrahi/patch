import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  List,
  Spin
} from "antd";
import Map from "./Map";
import logo from "../assets/patch.png";
import axios from "axios";
import uuid from "react-uuid";
import { Link } from "react-router-dom";
import {
  ASTRA_URL,
  ASTRA_USERNAME,
  ASTRA_PASSWORD,
  ASTRA_KEYSPACE
} from "../config/constants";
import { UserOutlined } from "@ant-design/icons";
import "./Home.css";
// import InfiniteScroll from "react-infinite-scroller";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allPatches, setAllPatches] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      }
    };

    const q_data = {
      username: ASTRA_USERNAME,
      password: ASTRA_PASSWORD
    };

    (async () => {
      const { data: { authToken } } = await axios.post(ASTRA_URL + "/auth", q_data, config);
      config.headers["X-Cassandra-Token"] = authToken;
      config.headers["X-Cassandra-Request-Id"] = uuid();

      const { data: { rows } } = await axios.get(
        ASTRA_URL + `/keyspaces/${ASTRA_KEYSPACE}/tables/records/rows/`,
        config
      );
      
      setAllPatches(rows);
      setLoading(false);
    })();
  }, [setAllPatches, setLoading]);

  return (
    <Row className="container">
      <Col md={12} lg={16}>
        <Map />
      </Col>
      <Col md={12} lg={8}>
        <div className="infoCol">
          <Divider plain>
            <h1 className="title">
              <Link to="/"><img src={logo} className="logo" alt="patch logo"/> Patch</Link>
            </h1>
          </Divider>
          <h2>Overview</h2>
          <p>Thanks for your interest! Patch is currently in beta. You are viewing things from an administrator's point of view.</p>
          <h2>All reports</h2>
          {loading ? (
            <div className="spinning">
              <Spin />
            </div>
          ) : (
            <List>
              {allPatches.map(patch => {
                const obj = JSON.parse(patch.obj);
                let bigger = "physical", smaller = "depression";
                if (obj.overall[bigger] < obj.overall[smaller]) {
                  [bigger, smaller] = [smaller, bigger];
                }
                
                let category = "high";
                if (obj.overall[bigger] < 0.75) {
                  category = "medium";
                }
                if (obj.overall[bigger] < 0.5) {
                  category = "low";
                }

                const desc = `${(obj.overall[bigger] * 100).toFixed(2)}% ${bigger}, ` +
                             `${(obj.overall[smaller] * 100).toFixed(2)}% ${smaller}, ` +
                             `${[obj.hiv ? "HIV" : "", obj.flu ? "Flu" : "", obj.blood_pressure ? "HBP" : "", obj.coronavirus ? "COVID" : ""].filter(v => v).join(", ")}`;

                return (
                  <div className={`report report-severity-${category}`}>
                    <Link to={`/${patch.id}`}>
                      <List.Item>
                        <UserOutlined />
                        <List.Item.Meta title={`Report ${patch.id}`} description={desc} />
                      </List.Item>
                    </Link>
                  </div>
                );
              })}
            </List>
          )}
          <p className="footer"><a href="https://marcusfran.co">Marcus Franco</a></p>
        </div>
      </Col>
    </Row>
  );
};

export default Home;
