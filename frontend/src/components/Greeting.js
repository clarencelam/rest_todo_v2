import React, { Component } from "react";

export class Greeting extends React.Component {
  state = {
    date: new Date()
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({ date: new Date() });
  }
  
  returnTimeVariedGreeting(){
    let currentHour = this.state.date.getHours();
    // should return the local time hour (0 to 23). 12:00AM is 0

    if(currentHour >= 5 && currentHour < 12){
      // morning greeting
      var greetingWords = "Good Morning."
    }
    else if(currentHour >= 12 && currentHour < 18){
      // afternoon greeting
      var greetingWords = "Good Afternoon."
    }
    else if(currentHour >= 18 && currentHour < 24){
      // evening greeting
      var greetingWords = "Good Evening."
    } else{
      // night greeting
      var greetingWords = "Good Night."
    }
    return greetingWords
  }

  returnWeekday(){
    var day = "";
    let currentWeekday = this.state.date.getDay();

    switch (currentWeekday) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
         day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
    return day;

  }

  render() {
    return (<div>
      <h2>{this.returnTimeVariedGreeting()}</h2>
      <h5>It's {this.returnWeekday()}, {this.state.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</h5>
      
      <h5>What's on your To-do list today?</h5>

      </div>
    );
  }
}

// ReactDOM.render(
//   <Clock />,
//   document.getElementById('root')
// );
