import React from 'react';
import './Timer.css'
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";


export class TimerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerOn: "off",
            timerAmount: 0,
        };
        this.handleChange = this.handleChange.bind(this)
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)

    }

    countDown() {
        if (this.state.timerOn === "on") {
            this.setState({
                timerAmount: this.state.timerAmount - 1
            })
            console.log("minute down")
        }
        if (this.state.timerAmount <= 0) {
            clearInterval(this.timerId)
            this.setState({
                timerOn: "done",
                timerAmount: 0
            })
        }
    }

    startCountDown() {
        this.timerId = setInterval(() => this.countDown(), 60000)
    }

    handleChange(e) {
        var value = e.target.value

        this.setState({
            timerAmount: value,
        })
    }

    startTimer() {
        this.setState({
            timerOn: "on"
        })
        this.startCountDown()
        console.log("Countdown started")
        console.log("Timer status: ", this.state.timerOn)
    }

    stopTimer() {
        this.setState({
            timerOn: "off"
        })
        console.log("Countdown paused")
        clearInterval(this.timerId)
    }


    render() {
        return (
            <div id="timer-container">
                <div id="title-row">
                    <h6>Focus Timer</h6>
                </div>

                <div class="row">
                    <div class="column-1">


                        <div id="enter-time">
                            <Form id="minutes">
                                <Input
                                    onChange={this.handleChange}
                                    value={this.state.timerAmount}
                                    disabled={this.state.timerOn === "on"}
                                ></Input>
                            </Form>
                            <div class="text">&nbsp;mins</div>
                        </div>

                        {
                            ((this.state.timerOn === "off") || (this.state.timerOn === "done")) &&
                            <Button onClick={this.startTimer}>Start Timer</Button>
                        }
                        {
                            this.state.timerOn === "on" &&
                            <Button onClick={this.stopTimer}>Stop</Button>
                        }


                    </div>

                    <div class="column-2">
                        <div class="row-1">
                            {this.state.timerOn === "on" &&
                                <>{this.state.timerAmount} minutes left</>
                            }
                            {this.state.timerOn === "done" &&
                                <>Focus session done!</>
                            }

                            {this.state.timerOn === "off" &&
                                <>TIMER OFF: 0 minutes left</>
                            }
                        </div>
                        <div class="row-1">
                            {this.state.timerOn === "on" &&
                                <>TIMER ON. FOCUS ON TASK</>
                            }
                            {this.state.timerOn === "off" &&
                                <>When you're ready, start the timer. <br></br>
                                    For the duration of the timer, focus on this task</>
                            }
                            {this.state.timerOn === "done" &&
                                <>Take a break until your next Focus session!</>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}