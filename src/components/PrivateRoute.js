import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import { AuthContext } from "../context/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
