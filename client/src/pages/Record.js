import React, { useEffect, useState } from "react";
import Map from "./Map";
import {
  Spin,
  Input,
  Row,
  Col,
  Divider,
  Tooltip
} from "antd";
import axios from "axios";
import "./Record.css";
import {
  ASTRA_URL,
  ASTRA_USERNAME,
  ASTRA_PASSWORD,
  ASTRA_KEYSPACE,
  RADAR_SECRET
} from "../config/constants";
import { Marker } from "react-map-gl";
import uuid from "react-uuid";
import logo from "../assets/patch.png";

const Record = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [badAddress, setBadAddress] = useState(false);
  const [record, setRecord] = useState({});
  const [where, setWhere] = useState(null);
  const [address, setAddress] = useState("");
  const { id } = match.params;
  
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
        ASTRA_URL + `/keyspaces/${ASTRA_KEYSPACE}/tables/records/rows/${id}`,
        config
      );
      
      setRecord(JSON.parse(rows[0].obj));
      setLoading(false);
    })();
  }, [setRecord, setLoading]);

  useEffect(() => {
    if (address) {
      (async () => {
        const { data: { addresses } } = await axios.get(
          `https://api.radar.io/v1/geocode/forward?query=${address}`,
          { headers: { "Authorization": RADAR_SECRET } }
        );

        if (addresses.length > 0) {
          setWhere({
            latitude: addresses[0].latitude,
            longitude: addresses[0].longitude
          });
        } else {
          setAddress("");
          setBadAddress(true);
        }

        setLoading(false);
      })();
    }
  }, [address, setAddress, setWhere, setBadAddress]);

  return (
    <Row className="container">
      <Col xs={16}>
        <Map>
          {where && (
            <Marker
              longitude={where.longitude}
              latitude={where.latitude}
              offsetLeft={-12}
              offsetTop={-24}
            >
              <Tooltip placement="top" title="You are here">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </Tooltip>
            </Marker>
          )}
        </Map>
      </Col>
      <Col xs={8}>
        <div className="infoCol">
          <Divider plain>
            <h1 className="title">
              <img src={logo} className="logo" alt="patch logo"/> Patch
            </h1>
          </Divider>
          {loading ? (
            <div className="spinning">
              <Spin />
            </div>
          ) : (
            !address ? (
              <>
                {badAddress && <h3 style={{ color: "#f00" }}>The address you have entered is invalid</h3>}
                <h4>Before you continue:</h4>
                <p>Please enter your address so that we can provide you with the most relevant information.</p>
                <Input.Search
                  placeholder="1234 Address St."
                  allowClear
                  enterButton="View Report"
                  size="large"
                  onSearch={val => { setAddress(val); setLoading(true); }}
                />
              </>
            ) : (
              <>
                <h2>Report</h2>
                <p>Our artificial intelligence </p>
              </>
            )
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Record;
