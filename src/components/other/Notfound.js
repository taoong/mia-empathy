import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
 * To show in place of a 404 error (no connection).
 */
class Notfound extends Component {
  render() {
    return (
      <div style={{ margin: "50px" }}>
        <h1>Sorry, this page can't be found!</h1>
        <Link to="/">
          <h3>Click here to go to the empathy quiz</h3>
        </Link>
      </div>
    );
  }
}

export default Notfound;
