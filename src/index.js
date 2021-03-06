import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/app/App";
import Admin from "./components/admin/Admin";
import Notfound from "./components/other/Notfound";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

const routing = (
  <Router>
    <div id="router">
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/admin" component={Admin} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
