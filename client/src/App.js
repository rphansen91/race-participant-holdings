import React from "react";
import Navbar from "./components/Navbar";
import Snackbar from "./components/Snackbar";
import Routes from "./routes";

export default () => (
  <div>
    <Navbar />
    <Routes />
    <Snackbar />
  </div>
);
