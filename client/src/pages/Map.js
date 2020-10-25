import React, { useEffect, useState } from "react";
import { message, Tooltip } from "antd";
import { GlobalOutlined, BugOutlined, UserOutlined } from "@ant-design/icons";
import { MAPBOX_TOKEN, API_URL } from "../config/constants";
import ReactMapGL, { Marker } from "react-map-gl";
import "./Map.css";
import axios from "axios";

const App = ({ children }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: -73.935242,
    latitude: 40.730610,
    zoom: 10,
    pitch: 45
  });
  const [fluData, setFluData] = useState([]);
  const [hivData, setHivData] = useState([]);
  const [bpData, setBpData] = useState([]);
  const [cvdData, setCvdData] = useState([]);

  useEffect(() => {
    const hideMessage = message.loading("Loading map data...", 0);

    axios
      .get(API_URL + "/data/flu")
      .then(res => { setFluData(res.data); })
      .catch(err => { message.warn("Could not load map data, aborting", 0); });

    axios
      .get(API_URL + "/data/hiv")
      .then(res => { setHivData(res.data); })
      .catch(err => { message.warn("Could not load map data, aborting", 0); })

    axios
      .get(API_URL + "/data/bp")
      .then(res => { setBpData(res.data); })
      .catch(err => { message.warn("Could not load map data, aborting", 0); })

    axios
      .get(API_URL + "/data/cvd")
      .then(res => { setCvdData(res.data); })
      .catch(err => { message.warn("Could not load map data, aborting", 0); })
      .then(hideMessage);
  }, [setFluData, setHivData, setBpData, setCvdData]);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={setViewport}
    >
      {fluData.map((place, idx) => (
        <Marker
          key={idx}
          longitude={parseFloat(place["Longitude"])}
          latitude={parseFloat(place["Latitude"])}
        >
          <Tooltip placement="top" title="Flu vaccines are available here.">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="mapPin mapPinOrange"
            >
              <circle cx="8" cy="8" r="3"></circle>
            </svg>
          </Tooltip>
        </Marker>
      ))}
      {bpData.map((place, idx) => (
        <Marker
          key={idx}
          longitude={parseFloat(place["Longitude2"])}
          latitude={parseFloat(place["Latitude2"])}
        >
          <Tooltip placement="top" title="Blood pressure tests are available here.">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="mapPin mapPinBlue"
            >
              <circle cx="8" cy="8" r="3"></circle>
            </svg>
          </Tooltip>
        </Marker>
      ))}
      {hivData.map((place, idx) => (
        <Marker
          key={idx}
          longitude={parseFloat(place["Longitude"])}
          latitude={parseFloat(place["Latitude"])}
        >
          <Tooltip placement="top" title={
            <div style={{ padding: "0.5em" }}>
              <p><b>{place["Site Name"]}</b></p>
              <p>{place.Address}, {place.Borough}, {place.State} {place["Zip Code"]}</p>
              {place.Website && <p><GlobalOutlined /> <a href={place.Website}>{place.Website}</a></p>}
              {place.Intake && <p><UserOutlined /> {place.Intake}</p>}
              <p><BugOutlined /> Distributes <b>HIV</b> tests</p>
            </div>
          }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="mapPin mapPinGreen"
            >
              <circle cx="8" cy="8" r="5"></circle>
            </svg>
          </Tooltip>
        </Marker>
      ))}
      {cvdData.map((place, idx) => (
        <Marker
          key={idx}
          longitude={parseFloat(place["Longitude"])}
          latitude={parseFloat(place["Latitude"])}
        >
          <Tooltip placement="top" title={
            <div style={{ padding: "0.5em" }}>
              <p><b>{place.Name}</b></p>
              <p>{place.Address}, {place.Borough}, {place.State} {place.Zip}</p>
              <p><BugOutlined /> Distributes <b>coronavirus</b> tests</p>
            </div>
          }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="mapPin mapPinRed"
            >
              <circle cx="8" cy="8" r="5"></circle>
            </svg>
          </Tooltip>
        </Marker>
      ))}
      {children}
    </ReactMapGL>
  );
}

export default App;
