import React, { Component } from "react";
/**
 * To show while fetching data from Firebase.
 */
class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }
}
export default Loading;
