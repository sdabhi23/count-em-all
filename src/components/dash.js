import React, { Component } from "react";
import "./dash.css";

import { logoutUser } from "../utils/identity";
import netlifyIdentity from "netlify-identity-widget";

import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Dropzone from "react-dropzone";

import axios from "axios";

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 'auto',
  height: '20vh',
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  width: 'auto',
  height: '100%',
  minWidth: 0
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

class Dash extends Component {

  constructor() {
    super()
    this.state = {
      user: null,
      fileURL: null,
      file: null
    };
  }

  componentDidMount() {
    this.fetchUser();
    console.log(this.state.user);
    netlifyIdentity.on("logout", user => {
      this.setState({ user: null }, logoutUser());
      this.props.history.push("/");
    });
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.file);
  }

  handleUpload = () => {
    console.log(this.state.file);
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("upload_preset", "qjjge8te");
    // axios
    //   .post(
    //     "https://api.cloudinary.com/v1_1/count-em-all/image/upload",
    //     formData,
    //     {
    //       headers: { "X-Requested-With": "XMLHttpRequest" }
    //     }
    //   )
    //   .then(response => {
    //     const data = response.data;
    //     const fileURL = data.secure_url; // You should store this URL for future references in your app
    //     console.log(data);
    //     console.log(fileURL);
    //   });
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
          <img
            src={this.state.fileURL}
            alt="uploaded image"
            style={img}
          />
        </div>
      </div>
    );

    return (
      <div className="Dash">
        <AppBar position="static">
          <Toolbar>
            <Typography id="title_main" variant="h6" color="inherit">
              Count'em All
            </Typography>
            <Button color="inherit" onClick={this.handleLogOut} size="large">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className="dash-main">
          <TextField
            label="Event Name"
            style={{ marginBottom: 20 }}
            fullWidth
            margin="normal"
          />
          <Dropzone className="main_drop" onDrop={this.onDrop} multiple={false}>
            {this.state.file ? (
              <aside style={thumbsContainer}>
                {thumbs}
              </aside>
            ):(
              <p>Try dropping a file here, or click to select file to upload.</p>
            )}
          </Dropzone>
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={this.handleUpload}
          >
            Analyze
          </Button>
        </div>
      </div>
    );
  }
}

export default Dash;
