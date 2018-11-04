import React, { Component } from "react";
import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./components/home";
import Dash from "./components/dash";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/dash" component={Dash} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
