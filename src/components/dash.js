import React, { Component } from "react";
import "./dash.css";

import { logoutUser } from "../utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AddLogo from "@material-ui/icons/Add";

import axios from "axios";

import { withRouter } from "react-router-dom";

const NewEventButton = withRouter(({ history }) => (
  <Button
    color="secondary"
    onClick={() => {
      history.replace("/new");
    }}
    className="new-event-fab"
    variant="extendedFab"
    size="large"
  >
    <AddLogo style={{ marginRight: "5px" }} />
    Event
  </Button>
));

const Events = ({ events }) => (
  <>
    {events.map(event => (
      <div
        className="card"
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "solid 1px black",
          height: "auto"
        }}
      >
        <img className="card-img" alt="" src={event.url} />
        <div className="card-body">
          <h1 className="card-title">{event.name}</h1>
          <p>Number of people in the picture: {event.count}</p>
          <p style={{ fontSize: "0.9em" }}>Added on: {event.uploaded_on}</p>
        </div>
      </div>
    ))}
  </>
);

class Dash extends Component {
  constructor() {
    super();
    this.state = { events: [] };
  }

  componentDidMount() {
    netlifyIdentity.on("logout", user => {
      this.setState({ user: null }, logoutUser());
      this.props.history.replace("/");
    });
    this.fetchAllEvents();
  }

  fetchAllEvents = () => {
    console.log(process.env.REACT_APP_HASURA);
    const user = JSON.parse(localStorage.getItem("currentCountemUser"));
    const user_id = user.id;
    var queryString = `query {
      users(where:{id: {_eq : "${user_id}"}}) {
        name
        email
        eventImagessByuserId {
          id
          name
          url
          uploaded_on
          analysis
        }
      }
    }`;
    axios
      .post("https://count-em-all-db.herokuapp.com/v1alpha1/graphql", {
        headers: {'X-Hasura-Access-Key': `${process.env.REACT_APP_HASURA}`},
        query: queryString
      })
      .then(response => {
        var data = response.data.data.users[0].eventImagessByuserId;
        data.map(elem => {
          var dt = new Date(elem.uploaded_on);
          elem.uploaded_on = dt.toLocaleString();
          elem.count = elem.analysis.length;
          return elem;
        });
        this.setState({ events: data });
        console.log("data received");
      })
      .catch(error => console.error(error));
  };

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  fetchUserName() {
    const user = localStorage.getItem("currentCountemUser");
    console.log(user);
  }

  render() {
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
          <NewEventButton />
          <Events events={this.state.events} />
        </div>
      </div>
    );
  }
}

export default Dash;
