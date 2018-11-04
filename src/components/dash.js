import React, { Component } from "react";
import "./dash.css";

import { logoutUser } from "../utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import axios from "axios";

import { withRouter } from "react-router-dom";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: "auto",
  height: "20vh",
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  width: "auto",
  height: "100%",
  minWidth: 0
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

const NewEventButton = withRouter(({ history }) => (
  <Button
    color="primary"
    onClick={() => {
      history.replace("/new");
    }}
    variant="contained"
    size="large"
  >
    New Event
  </Button>
));

class Dash extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      fileURL: null,
      file: null,
      eventName: ""
    };
  }

  componentDidMount() {
    this.fetchUser();
    console.log(this.state.user);
    netlifyIdentity.on("logout", user => {
      this.setState({ user: null }, logoutUser());
      this.props.history.replace("/");
    });
  }

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  fetchUser() {
    const user = localStorage.getItem("currentCountemUser");
    console.log(user);
    this.setState({ user: JSON.parse(user) });
    console.log(this.state.user);
  }

  render() {
    const thumbs = (
      <div style={thumb}>
        <div style={thumbInner}>
          <img src={this.state.fileURL} alt="uploaded image" style={img} />
        </div>
      </div>
    );

    return (
      <div className="Dash">
        <AppBar position="static">
          <Toolbar>
            <Typography id="title-main" variant="h6" color="inherit">
              Count'em All
            </Typography>
            <Button color="inherit" onClick={this.handleLogOut} size="large">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className="dash-main">
          <NewEventButton/>
        </div>
      </div>
    );
  }
}

export default Dash;
