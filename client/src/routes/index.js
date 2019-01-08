import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import CreateRace from "./CreateRace";
import JoinRace from "./JoinRace";

export default () => (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create-race" component={CreateRace} />
      <Route exact path="/join-race/:id" component={JoinRace} />
    </Switch>
);