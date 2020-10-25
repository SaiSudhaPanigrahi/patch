import React, { useEffect, useState } from "react";
import { message, Tooltip } from "antd";
import {
  GlobalOutlined,
  BugOutlined,
  UserOutlined, 
  FileOutlined,
  PlusOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import { MAPBOX_TOKEN, API_URL } from "../config/constants";
import ReactMapGL, { Marker } from "react-map-gl";
import "./Map.css";
import axios from "axios";

const App = ({ children, gotData }) => {
  const [viewport, setViewport] = useState({
    longitude: -73.935242,
    latitude: 40.730610,
    zoom: 10,
    pitch: 45
  });
  const [fluData, setFluData] = useState([]);
  const [hivData, setHivData] = useState([]);
  const [bpData, setBpData] = useState([]);
  const [cvdData, setCvdData] = useState([]);

  const trulySetViewport = vp => {
    const { width, height, ...etc } = vp;
    setViewport(etc);
  };

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
      .then(() => {
        hideMessage();
      });
  }, [setFluData, setHivData, setBpData, setCvdData]);

  /*
  useEffect(() => {
    gotData(fluData, hivData, bpData, cvdData);
  }, [fluData, hivData, bpData, cvdData, gotData])
  */

  return (
    <ReactMapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      onViewportChange={trulySetViewport}
    >
      {fluData.map((place, idx) => (
        <Marker
          key={idx}
          longitude={parseFloat(place["Longitude"])}
          latitude={parseFloat(place["Latitude"])}
        >
          <Tooltip placement="top" title={
            <div style={{ padding: "0.5em" }}>
              <p><b>{place["Facility Name"]}</b></p>
              {place["Phone"] && <p><b>{place["Phone"]}</b></p>}
              <p>{place.Address}, {place.Borough}, New York {place["ZIP Code"]}</p>
              {place.Website && <p><GlobalOutlined /> <a href={place.Website}>{place.Website}</a></p>}
              {place["Walk-in"] && <p><UserOutlined /> Walk-in: {place["Walk-in"]}</p>}
              {place["Insurance"] && <p><FileOutlined /> Insurance: {place["Insurance"]}</p>}
              {place["Children"] && <p><UserOutlined /> Children: {place["Children"]}</p>}
              <p><BugOutlined /> Distributes <b>flu</b> vaccinations</p>
              {place["More Information"] && <p>Additional info: {place["More Information"]}</p>}
            </div>
          }>
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
          <Tooltip placement="top" title={
            <div style={{ padding: "0.5em" }}>
              <p><b>{place["INPUT_1_FacilityName"]}</b></p>
              {place["INPUT_1_Phone2"] && <p><b>{place["INPUT_1_Phone2"]}</b></p>}
              <p>{place["INPUT_1_Address"]} {place["Building Number"]}, {place["INPUT_1_Borough"]}, New York {place["INPUT_1_ZipCode"]}</p>
              <p><DollarCircleOutlined /> Free</p>
              <p><BugOutlined /> Distributes <b>blood pressure</b> checks</p>
              {place["INPUT_1_AdditionalInfo2"] && <p>Additional info: {place["INPUT_1_AdditionalInfo2"].replace(/<p>/g, '').replace(/<\/p>/g, '')}</p>}
            </div>
          }>
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
              {place["Phone Number"] && <p><b>{place["Phone Number"]}</b></p>}
              <p>{place.Address} {place["Building Floor Suite"]}, {place.Borough}, {place.State} {place["Zip Code"]}</p>
              {place.Website && <p><GlobalOutlined /> <a href={place.Website}>{place.Website}</a></p>}
              {place.Intake && <p><UserOutlined /> Intake: {place.Intake}</p>}
              {place["Ages Served"] && <p><UserOutlined /> Ages served: {place["Ages Served"]}</p>}
              {place["Genders Served"] && <p><UserOutlined /> Genders served: {place["Genders Served"]}</p>}
              {place["Required Documents"] && <p><FileOutlined /> Required documents: {place["Required Documents"]}</p>}
              {place.Medicaid && <p><PlusOutlined /> Medicaid: {place.Medicaid}</p>}
              {place.Medicare && <p><PlusOutlined /> Medicare: {place.Medicare}</p>}
              {place["Sliding Fee"] && <p><DollarCircleOutlined /> Sliding fee: {place["Sliding Fee"]}</p>}
              {place["Other Insurances"] && <p><FileOutlined /> Other insurances: {place["Other Insurances"]}</p>}
              {place["Low Cost"] === "TRUE" && <p><DollarCircleOutlined /> Low cost</p>}
              {place["Free"] === "TRUE" && <p><DollarCircleOutlined /> Free</p>}
              <p><BugOutlined /> Distributes <b>HIV</b> tests</p>
              {place["Additional Information"] && <p>Additional info: {place["Additional Information"]}</p>}
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
