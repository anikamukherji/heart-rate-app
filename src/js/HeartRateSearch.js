import React, { Component } from 'react';
import '../css/HeartRateSearch.css';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {cyan500} from 'material-ui/styles/colors';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

var hostName = "http://vcm-3576.vm.duke.edu:5000/" 


const muiThemeWhiteText = getMuiTheme({
  textField: {
    textColor: 'white',
    hintColor: 'white',
    labelColor: 'white',
    floatingLabelColor: cyan500,
  },
});


class HeartRateSearch extends Component {

  constructor() {
    super();
    this.state = {
      currUser: null,
      userHR: [null],
      numHR: null,
      maxHR: null,
      graphVisible: false,
    };
  }

  getHR = event => {
    var requestURL = hostName + "api/heart_rate/" + this.state.currUser
    axios.get(requestURL).then( response => { 
      console.log(response.status);
      this.setState({
                      userHR: response.data,
                      numHR: response.data.length,
                      maxHR: Math.max(...response.data),
                      graphData: this.formatData(response.data),
                      graphVisible: true,
                    });
    }); 
  }

  formatData = array => {
    var newArr = [] 
    for (var i = 0; i < array.length; i++) {
      newArr.push({
                  "heart rate": array[i],
                  "label": ""
                  }) 
    }
    newArr[array.length-1].label = "most recent"
    return newArr
  }

  handleChange = event => {
    this.setState({currUser: event.target.value});
  }

  renderGraph = () => {
    if (this.state.graphVisible) {
      return (
          <div className="graph">
            <h1 className="graph-title">all heart rates for {this.state.currUser} </h1>
            <LineChart className="chart" width={400} height={400} data={this.state.graphData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
              <Line type="monotone" dataKey="heart rate" stroke={cyan500} activeDot={{r: 8}}/>
              <Tooltip/>
              <XAxis dataKey="label" stroke='white'/>
              <YAxis stroke='white'/>
            </LineChart>
          </div>
        )
      }
  }

  render() {
    return (
      <div className="hrsearch-body">
        <MuiThemeProvider muiTheme={muiThemeWhiteText}>
          <div className="email-field">
            <TextField
              hintText="Who Are You?"
              floatingLabelText="Email"
              type="Email" 
              onChange={this.handleChange} />
          </div>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <div className="email-search-button">
            <RaisedButton 
              primary={true}
              label="Find Heart Rate"
              labelColor="white" 
              onClick={this.getHR}/>
          </div>
          <p className="text">Most recent heart rates for this user is...</p>
          <p className="text">{this.state.userHR[this.state.numHR - 1]}</p>
          <p className="text">Total number heart rates stored for this user is...</p>
          <p className="text">{this.state.numHR}</p>
          <p className="text">Max heart rate stored for this user is...</p>
          <p className="text">{this.state.maxHR}</p>
          {this.renderGraph()}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default HeartRateSearch;
