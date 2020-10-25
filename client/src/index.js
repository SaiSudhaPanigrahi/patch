import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./pages/Home";
import Record from "./pages/Record";
import ErrorPage from "./pages/ErrorPage";
import { BrowserRouter, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:id(\w{10})" component={Record} />
      <Route component={ErrorPage} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);