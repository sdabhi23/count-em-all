import React, { Component, Fragment } from "react";
import "./home.css";

import { loginUser, logoutUser } from "../utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { withRouter } from "react-router-dom";

const DashButton = withRouter(({ history }) => (
  <Button
    color="primary"
    onClick={() => {
      history.replace("/dash");
    }}
    variant="contained"
    size="large"
  >
    Dashboard
  </Button>
));

class Home extends Component {
  state = { user: null };

  componentDidMount() {
    const user = localStorage.getItem("currentCountemUser");
    if (user) {
      this.setState({ user: JSON.parse(user) });
    } else {
      loginUser();
    }
    netlifyIdentity.on("login", user => {
      this.setState({ user }, loginUser());
      this.props.history.replace("/dash");
    });
    netlifyIdentity.on("logout", user =>
      this.setState({ user: null }, logoutUser())
    );
    console.log(process.env.REACT_APP_TEST);
    console.log(process.env.REACT_APP_HASURA);
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
      <div className="Home">
        <div className="main">
          <Typography
            variant="h3"
            color="inherit"
            style={{ marginBottom: "20px" }}
          >
            Count'em All
          </Typography>
          <Typography variant="h5">
            A simple app to count the number of people attending a gathering!
          </Typography>
          <p>
            Now leverage the power of Machine Learning in managing the attedants
            of your event. With Count'em All you can now use the extensively
            trained and professionally developed models from Clarifai to
            reliably count the number of people attending your event right from
            your browser!
          </p>
          {user ? (
            <Fragment>
              <Button
                color="primary"
                onClick={this.handleLogOut}
                variant="contained"
                size="large"
                style={{ marginRight: "20px" }}
              >
                Logout
              </Button>
              <DashButton />
            </Fragment>
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
          <br />
          <a href="https://hasura.io">
            <img
              id="hasura"
              width="150px"
              alt="powered by Hasura"
              src="https://graphql-engine-cdn.hasura.io/img/powered_by_hasura_black.svg"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
