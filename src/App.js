import React, { Component, Fragment } from "react";
import "./App.css";

import { loginUser, logoutUser } from "./utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

class App extends Component {
  state = { user: null };

  componentDidMount() {
    const user = localStorage.getItem("currentCountemUser");
    if (user) {
      this.setState({ user: JSON.parse(user) });
    } else {
      loginUser();
    }
    netlifyIdentity.on("login", user => this.setState({ user }, loginUser()));
    netlifyIdentity.on("logout", user => this.setState({ user: null }, logoutUser()));
  }

  handleLogIn = () => {
    netlifyIdentity.open("login");
  };

  handleSignUp = () => {
    netlifyIdentity.open("signup");
  };

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  render() {
    const user = this.state.user;
    return (
      <div className="App">
        <div className="main">
          <Typography
            variant="h3"
            color="inherit"
            style={{ marginBottom: "20px" }}
          >
            Catch'em All
          </Typography>
          <Typography variant="h5">
            A simple app to count the number of people attending a gathering!
          </Typography>
          <p>
            Now leverage the power of AI in managing the attedants of your
            event. With Count'em All you can now use the extensively trained and
            professionally developed models from Clarifai to reliably count the
            number of people attending your event right from your browser!
          </p>
          {user ? (
            <Button
              color="primary"
              onClick={this.handleLogOut}
              variant="contained"
              size="large"
            >
              Logout
            </Button>
          ) : (
            <Fragment>
              <Button
                color="primary"
                onClick={this.handleSignUp}
                variant="contained"
                size="large"
                style={{ marginRight: "20px" }}
              >
                Signup
              </Button>
              <Button
                color="primary"
                onClick={this.handleLogIn}
                variant="contained"
                size="large"
              >
                Login
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default App;
