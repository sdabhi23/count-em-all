import React, { Component } from "react";
import "./newEvent.css";

import { logoutUser } from "../utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Dropzone from "react-dropzone";

import { withRouter } from "react-router-dom";

import Clarifai from "clarifai";

import axios from "axios";

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI
});

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

const MenuBackButton = withRouter(({ history }) => (
  <IconButton
    color="inherit"
    style={{ marginLeft: -12, marginRight: 20 }}
    onClick={() => history.replace("/dash")}
  >
    <ArrowBackIcon />
  </IconButton>
));

class NewEvent extends Component {
  constructor() {
    super();
    this.state = {
      fileURL: null,
      file: null,
      eventName: "",
      processing: false
    };
  }

  componentDidMount() {
    console.log(this.state.user);
    netlifyIdentity.on("logout", user => {
      this.setState({ user: null }, logoutUser());
      this.props.history.replace("/");
    });
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.file);
  }

  handleUpload = () => {
    this.setState({ processing: true });
    const finalFile = this.state.file;
    const eventName = this.state.eventName;
    if (finalFile === null || eventName === "") {
      alert("Event name and picture cannot be empty");
    } else {
      const formData = new FormData();
      formData.append("file", finalFile);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY);
      axios
        .post(
          "https://api.cloudinary.com/v1_1/count-em-all/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" }
          }
        )
        .then(response => {
          const data = response.data;
          const fileURL = data.secure_url;
          console.log("image uploaded");
          this.processImg(eventName, fileURL);
        });
    }
  };

  processImg = (eventName, fileURL) => {
    app.models
      .predict("a403429f2ddf4b49b307e318f00e528b", fileURL)
      .then(res => {
        console.log("image processsed");
        this.saveToDb(eventName, fileURL, res.outputs[0].data.regions);
      })
      .catch(err => console.log(err));
  };

  saveToDb = (eventName, fileURL, imgAnalysis) => {
    var user = JSON.parse(localStorage.getItem("currentCountemUser"));
    const user_id = user.id;
    const mutationPayload = `mutation insertEvent($analysis: json) {
      insert_event_images(objects: [{user_id: "${user_id}", name: "${eventName}", url: "${fileURL}", analysis: $analysis }]) {
        returning {
          id
          url
        }
      }
    }`;
    console.log("mutation generated");
    user = netlifyIdentity.currentUser();
    var jwt = user.jwt();
    jwt
      .then(token => {
        axios
          .post(
            process.env.REACT_APP_GQL_ENDPOINT,
            {
              query: mutationPayload,
              variables: {
                analysis: imgAnalysis
              }
            },
            { headers: { authorization: "Bearer " + token } }
          )
          .then(response => {
            console.log("data saved");
            this.setState({ processing: false });
            this.props.history.replace("/dash");
          })
          .catch(error => console.error(error));
      })
      .catch(error => {
        console.log("Error fetching JWT token", error);
      });
  };

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  onDrop = files => {
    this.setState({
      file: files[0],
      fileURL: URL.createObjectURL(files[0])
    });
  };

  render() {
    const thumbs = (
      <div style={thumb}>
        <div style={thumbInner}>
          <img src={this.state.fileURL} alt="uploaded" style={img} />
        </div>
      </div>
    );

    return (
      <div className="NewEvent">
        <AppBar position="static">
          <Toolbar>
            <MenuBackButton />
            <Typography id="title-main" variant="h6" color="inherit">
              Count'em All
            </Typography>
            <Button color="inherit" onClick={this.handleLogOut} size="large">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className="newEvent-main">
          <TextField
            label="Event Name"
            style={{ marginBottom: 20 }}
            fullWidth
            onChange={event => this.setState({ eventName: event.target.value })}
            margin="normal"
            disabled={this.state.processing}
          />
          <Dropzone
            className="drop-main"
            accept="image/*"
            onDrop={this.onDrop}
            multiple={false}
            disabled={this.state.processing}
          >
            {this.state.file ? (
              <aside style={thumbsContainer}>{thumbs}</aside>
            ) : (
              <p>
                Try dropping a file here, or click to select file to upload.
              </p>
            )}
          </Dropzone>
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={this.handleUpload}
            disabled={this.state.processing}
          >
            Analyze
          </Button>
          {!this.state.processing ? (
            ""
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "25px"
              }}
            >
              <CircularProgress color="primary" size={50} thickness={4} />
              <Typography variant="h4" style={{ marginLeft: "15px" }}>
                Processing...
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NewEvent;
