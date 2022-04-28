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
            timerOn: false,
            timerAmount: 0,
        };
        this.handleChange = this.handleChange.bind(this)
        this.startTimer = this.startTimer.bind(this)
    }

    countDown() {
        if (this.state.timerOn === true) {
            this.setState({
                timerAmount: this.state.timerAmount - 1
            })
            console.log("minute down")
        }
        if (this.state.timerAmount <= 0) {
            clearInterval(this.timerId)
        }
    }

    startCountDown() {
        this.timerId = setInterval(() => this.countDown(), 1000)
    }

    handleChange(e) {
        var value = e.target.value

        this.setState({
            timerAmount: value,
        })
    }

    startTimer() {
        this.setState({
            timerOn: true
        })
        this.startCountDown()
        console.log("Countdown started")
        console.log("Timer status: ", this.state.timerOn)
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
                                <Form id="small">
                                    <Input
                                        onChange={this.handleChange}
                                    ></Input>
                                </Form>
                            <div class="text">&nbsp;mins</div>
                        </div>

                        <Button onClick={this.startTimer}>Start Timer</Button>


                    </div>

                    <div class="column-2">
                        {this.state.timerAmount} minutes left
                    </div>
                </div>
            </div>
        )
    }
}