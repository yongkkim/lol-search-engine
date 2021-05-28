import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setError } from "./redux/actions";
// import { device } from "../components/device";

const AlertMsg = styled.div`
  position: absolute;
  top: 115px;
  width: 40%;
  border-radius: 10px;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  padding: 5px 10px;
`;

//   @media ${device.mobileRotate} {
//     margin-top: 100px;
//   }

//   @media ${device.mobileM} {
//     width: unset;
//   }

//   @media ${device.mobileS} {
//     width: unset;
//     top: 330px;
//   }

const Close = styled.span`
  cursor: pointer;
  float: right;
`;

const ErrorAlert = ({ errorMsg, setError }) => {
  return (
    <AlertMsg role="error-message" aria-label="error-message">
      <span>{errorMsg}</span>
      <Close onClick={() => setError(false)}>X</Close>
    </AlertMsg>
  );
};

const mapStateToProps = (state) => {
  return {
    errorMsg: state.errorMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (error) => dispatch(setError(error)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorAlert);
