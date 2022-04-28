import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw, ContentState, getCurrentContent } from 'draft-js';
import {TimerComponent} from "./Timer.js"

export class FocusModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
        this.toggleEdit = this.toggleEdit.bind(this)
        this.saveChanges = this.saveChanges.bind(this)

    }
    

    toggleEdit() {
        this.setState({
            editing: !this.state.editing
        });
    }


    saveChanges(){
        var csrftoken = this.props.getCookies('csrftoken')

        this.setState({
            editing: false
          });

          var url = `http://localhost:8000/api/task-update/${this.props.todoItem.id}/`
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
               'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(this.props.todoItem)
          }).then((response) => {
            // this.fetchTasks()
            console.log(this.state.editing)
          }).catch(function (error) {
            console.log('ERROR: ', error)
          })
      
    }


    render() {
        return (

            <>
                <Modal isOpen={this.props.isOpen} 
                toggle={this.props.toggle} 
                className={this.props.className}
                centered>
                    <ModalHeader toggle={this.toggle}>
                        {this.state.editing == false ? (
                            <span>{this.props.todoItem.title}</span>
                        ) : (
                            <Form>
                                <Input onChange={this.props.onChange} value={this.props.todoItem.title}></Input>
                            </Form>
                        )
                        }
                    </ModalHeader>
                    <ModalBody>
                        {this.state.editing == false ? (
                        this.props.todoItem.description
                        ) : (
                            <Form>
                                <Input type="textarea" 
                                placeholder="Type extra details here"
                                onChange={this.props.onDescChange} 
                                value={this.props.todoItem.description}></Input>
                            </Form>
                        )}
                    </ModalBody>
                    <ModalBody>
                        <TimerComponent />

                    </ModalBody>
                    <ModalFooter>
                        {this.state.editing ? 
                            <>
                            <Button 
                            onClick={() => { this.saveChanges();}}
                            >Save Changes</Button>
                            </>
                            : 
                            <>
                            <Button onClick={() => {this.toggleEdit()}}>Edit</Button>
                            <Button onClick={this.props.toggleComplete}>Complete Task</Button>
                            <Button onClick={this.props.toggle}>Close</Button>
                            </>
                        }
                    </ModalFooter>
                </Modal>

            </>
        );
    }
}

