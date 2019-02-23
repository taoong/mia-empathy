import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import Admin from "./components/Admin";
import Sessions from "./components/Sessions";
import Quizzes from "./components/Quizzes";
import Notfound from "./components/Notfound";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/sessions" component={Sessions} />
        <Route path="/admin/quizzes" component={Quizzes} />
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
