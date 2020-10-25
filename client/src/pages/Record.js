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
import { Link } from "react-router-dom";

const Record = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [badAddress, setBadAddress] = useState(false);
  const [record, setRecord] = useState({});
  const [where, setWhere] = useState(null);
  // const [closest, setClosest] = useState([]);
  // const [geoData, setGeoData] = useState({});
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
  }, [setRecord, setLoading, id]);

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

  /*
  useEffect(() => {
    if (geoData !== {}) {
      const theClosest = {};
      for (let key in geoData) {
        if (geoData.hasOwnProperty(key)) {
          let minloc = null, theloc = null;
          console.log(geoData[key]);
          geoData[key].forEach(loc => {
            (async () => {
              const lat = "Latitude" in loc
                ? loc["Latitude"] : ("Latitude2" in loc
                ? loc["Latitude2"] : loc["latitude"]);
              const lng = "Longitude" in loc
                ? loc["Longitude"] : ("Longitude2" in loc
                ? loc["Longitude2"] : loc["longitude"]);

              if (lat && lng) {
                const { routes: { car } } = await axios.get(
                  `https://api.radar.io/v1/route/distance?units=`+
                  `imperial&modes=car&origin=${where.latitude},`+
                  `${where.longitude}&destination=${lat},${lng}`,
                  { headers: { "Authorization": RADAR_SECRET } }
                );
                if (!minloc || car.distance.value < minloc.distance.value) {
                  minloc = car;
                  theloc = loc;
                }
              }
            })();
          })
          theClosest[key] = theloc;
        }
      }
      setClosest(theClosest);
      console.log(theClosest);
    }
  }, [])

  const gotData = (flu, hiv, bp, cvd) => {
    setGeoData({
      flu_data: flu,
      hiv_data: hiv,
      bp_data: bp,
      cvd_data: cvd,
    });
  };
  */

  const renderReport = () => {
    const list = [
      record.hiv ? "HIV" : "",
      record.flu ? "the seasonal flu" : "",
      record.blood_pressure ? "blood pressure": "",
      record.coronavirus ? "coronavirus" : ""
    ].filter(v => v);
    const otherConcerns = !!list.length;
    const mentalConcern = record.overall.depression > 0.125;
    const physicalConcern = record.overall.depression > 0.125 || true;

    return (
      <>
        <h2>Your personalized report</h2>
        <h3>Language readings</h3>
        <p>
          Our artificial intelligence analyzed <b>{record.sentences.length}</b> sentences,
          and believed with high confidence that around <b>{(record.overall.physical * 100).toFixed(2)}</b>%
          of the language used in those sentences indicated that you are suffering physically and around
          <b> {(record.overall.depression * 100).toFixed(2)}</b>% indicated that you are suffering mentally.
        </p>
        {otherConcerns && (
          <p>
            We also detected that you may have expressed concerns related to <b>{list.join(", ")}</b>, which rest assured
            we will provide guidance on.
          </p>
        )}
        <p>
          It is important to note that this is <b>not a sophisticated artificial intelligence model...</b> yet.
        </p>
        {mentalConcern && (
          <>
            <h3>Our emotional guidance</h3>
            <p>Firstly, you should know that <b>you are valuable.</b> We would like to do the best we can for you.</p>
            <p>Secondly, you should know that <b>you are not alone.</b> You are battling something that millions of others are battling as well - you're in this together.</p>
            <p>Finally, you should know that <b>it is going to be hard. But you are strong,</b> and it is always within your grasp to move forward - always.</p>
            <p>Emotional support is always available at the following phone numbers:</p>
            <ul>
              <li><a href="https://suicidepreventionlifeline.org/">1-800-273-8255: Suicide Prevention Lifeline</a></li>
              <li><a href="https://www.crisistextline.org/">Text HOME to 741741: Crisis Textline</a></li>
              <li><a href="https://suicidepreventionlifeline.org/chat/">Lifeline Chat</a></li>
            </ul>
          </>
        )}
        {physicalConcern && (
          <>
            <h3>Our physical guidance</h3>
            <p>
              Due to the COVID-19 pandemic, it is of utmost importance that you be tested. You seem to show symptoms
              that are, at the very least, very similar to those experienced by individuals with the coronavirus.
              Your address is now located on the map, which will allow you to identify the closest coronavirus testing facility
              in the proximity, marked by a large <b style={{ color: "#ff0000" }}>red dot.</b> It is also very important to find the time to receive
              your seasonal flu vaccination from the nearest facility available to you. Those are marked by an <b style={{ color: "#ff5a08" }}>orange dot.</b>
            </p>
          </>
        )}
        {otherConcerns && (
          <>
            <h3>Other concerns</h3>
            <p>
              Institutions that administer tests for HIV are marked by a <b style={{ color: "#08ff5a" }}>green dot.</b>
            </p>
            <p>
              {list.length > 1 ? "Similarly, i" : "I"}nstitutions that administer <b>free</b> blood pressure tests are marked by a <b style={{ color: "#085aff" }}>blue dot.</b>
            </p>
          </>
        )}
        <p>Note: you are able to hover your mouse over any dot (or tap on mobile) to see the information provided by the facility.</p>
      </>
    );
  }

  return (
    <Row className="container">
      <Col md={12} lg={16}>
        <Map /*gotData={gotData}*/>
          {where && (
            <Marker
              longitude={where.longitude}
              latitude={where.latitude}
              offsetLeft={-12}
              offsetTop={-24}
            >
              <Tooltip placement="top" title="You are here">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </Tooltip>
            </Marker>
          )}
        </Map>
      </Col>
      <Col md={12} lg={8}>
        <div className="infoCol">
          <Divider plain>
            <h1 className="title">
              <Link to="/"><img src={logo} className="logo" alt="patch logo"/> Patch</Link>
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
              renderReport()
            )
          )}
          <p className="footer"><a href="https://marcusfran.co">Marcus Franco</a></p>
        </div>
      </Col>
    </Row>
  );
};

export default Record;
