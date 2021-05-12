import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import 'antd/dist/antd.css';
import './index.css'


//!!conecta a url del back
const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class App extends Component {

  state ={
    charts: {}

  }

 componentDidMount() {
   //This onopen function waits for you websocket connection to establish before sending the message.
    client.onopen = () => client.send("Message");

    client.onmessage = ({data}) => {
      console.log({message: data})
      const dataFromServer = JSON.parse(data);
      console.log('got reply! ', dataFromServer);
      this.setState({charts: dataFromServer})
    };
  }
  render() {
    return (
      <div className="main" id='wrapper'>
        <div className="main" id='wrapper'>
          {JSON.stringify(this.state.charts)}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));