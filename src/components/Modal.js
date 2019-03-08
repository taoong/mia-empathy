import React from "react";
import PropTypes from "prop-types";

function Modal(props) {
  const showHideClassname = props.show
    ? "modal display-block"
    : "modal display-none";
  return (
    <div className={showHideClassname}>
      <section className="modal-main">
        <button className="close-button" onClick={props.handleClose}>
          &#10005;
        </button>
        <div>{props.children}</div>
        <button className="button" onClick={props.handleSubmit}>
          {props.submitText}
        </button>
      </section>
    </div>
  );
}

Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.array.isRequired
};

export default Modal;
