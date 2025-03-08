import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

const Authmiddleware: React.FC<any> = ({
  component: Component,
  //layout: Layout,
  isAuthProtected,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    onEnter={() => console.log("Entered /")}
    render={(props: JSX.IntrinsicAttributes) => {
      return (
        <Component {...props} />
      );
    }}
  />
);

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  //layout: PropTypes.any,
  user: PropTypes.any,
};

export default Authmiddleware;
