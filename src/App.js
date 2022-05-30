import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Text from "./pages/Text";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <PrivateRoute exact path="/" component={Home}></PrivateRoute>
          <PrivateRoute
            exact
            path="/profile"
            component={Profile}
          ></PrivateRoute>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/text" component={Text}></Route>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
