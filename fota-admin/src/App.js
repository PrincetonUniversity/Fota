import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 40.3468,
      lng: 74.6552,
      radius: "1"
    };
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleLatChange = this.handleLatChange.bind(this);
    this.handleLngChange = this.handleLngChange.bind(this);
  }

  handleRadiusChange(event) {
    this.setState({radius: event.target.value});
  }

  handleLatChange(event) {
    this.setState({lat: event.target.value});
  }

  handleLngChange(event) {
    this.setState({lng: event.target.value});
  }

  fetchPhotos() {
    const { lat, lng, radius } = this.state
    axios.get(`https://fotafood.herokuapp.com/api/photo?order=${'hot'}&lat=${lat}&lng=${lng}&distance=${radius}`).then((response) => console.log(response))
    .catch((e) => { console.log(e )});
  }

  render() {
    return (
      <div className="App">
        Fota Admin Page
        <div className="Search">
          <p>Enter Search Coordinates:</p>
          Lat: <input value={this.state.lat} onChange={this.handleLatChange} style={{marginRight: "25px"}}></input>
        Lng: <input value={this.state.lng} onChange={this.handleLngChange} ></input>
          <p>Select your search radius: </p>
          <input type="radio" name="radius" value="1" onChange={this.handleRadiusChange} checked={this.state.radius === "1"}/> 1 Mi.<br />
          <input type="radio" name="radius" value="3" onChange={this.handleRadiusChange} checked={this.state.radius === "3"}/> 3 Mi.<br />
          <input type="radio" name="radius" value="5" onChange={this.handleRadiusChange} checked={this.state.radius === "5"}/> 5 Mi.<br />
          <input type="radio" name="radius" value="10"onChange={this.handleRadiusChange} checked={this.state.radius === "10"} /> 10 Mi.<br />
        </div>
        <button className="btn btn-primary" onClick={this.fetchPhotos.bind(this)}>Search</button>
      </div>
    );
  }
}

export default App;
