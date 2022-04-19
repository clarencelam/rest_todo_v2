import React, { Component } from 'react';
import './App.css';
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
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { convertToHTML, convertFromHTML } from 'draft-convert';



class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
        description: '',
      },
      editing: false,
      modalOpen: false,
      editorState: EditorState.createEmpty()


      
    }

    // This line gives us access to "this" method within fetchTasks function
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)

    this.closeModal = this.closeModal.bind(this)

    this.startTitleChange = this.startTitleChange.bind(this)
    this.saveTitleChange = this.saveTitleChange.bind(this)

    this.toggleCompleteTask = this.toggleCompleteTask.bind(this)

    this.handleChangeDesc = this.handleChangeDesc.bind(this)

  };

  // Function to call when we want to open the modal to focus on a task
  openModal(task) {
    this.setState({
      activeItem: task,
      modalOpen: true,
    },    
    )
  }

  // Function to call when we want to close the modal
  closeModal(task) {
    this.setState({
      activeItem: {
        id: null,
        title: '',
        completed: false,
        description: '',
      },
      modalOpen: false,
      editing: false,
      editorState: EditorState.createEmpty()
    })
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // "Lifecycle method"
  componentWillMount() {
    // Modal.setAppElement('body');
    this.fetchTasks()
  }

  // Component which fetches the latest todoList data from backend
  fetchTasks() {
    console.log('Fetching... ')

    fetch('http://127.0.0.1:8000/api/task-list/')
      .then(response => response.json())
      .then(data =>
        this.setState({
          todoList: data,
        })
      )
  }

  // Function to listen for change events in description updates

  // old function which enabled a description with a simple text field

  // handleChangeDesc(e) {
  //   var name = e.target.name
  //   var value = e.target.value
  //   console.log('Name:', name)
  //   console.log('Desc:', value)

  //   this.setState({
  //     activeItem: {
  //       ...this.state.activeItem,
  //       description: value,
  //     }
  //   })
  // }

  // new function to handle changes with the editorState
  handleChangeDesc = editorState => {
    const contentState = editorState.getCurrentContent();

    console.log('editorState:', editorState)
    console.log('contentState in JSON', JSON.stringify(convertToRaw(contentState)))


    this.setState({
      editorState,
      activeItem: {
        ...this.state.activeItem,
        description: convertToHTML(contentState)
      }
    })
  }



  // Function to listen for change events
  handleChange(e) {
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    })
  }

  // Component to handle TODO item submissions
  handleSubmit(e) {
    e.preventDefault()
    console.log('ACTIVE ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    // We want to send POST data to another URL (backend)
    var url = 'http://localhost:8000/api/task-create/'

    if (this.state.editing == true) {
      url = `http://localhost:8000/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing: false
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks() // Fetch the updated list of tasks
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
          description: '',
        }
      })
    }).catch(function (error) {
      console.log('ERROR: ', error)
    })
  }

  startTitleChange() {
    // these const values are a part of my hacky code for the rich text editor to initiate with current description values
    const regex = /(<([^>]+)>)/ig;
    const plaintextdescription = this.state.activeItem.description.toString()
    const unhtmlplaintext = plaintextdescription.replace(regex, '')
    const existingcontentstate = ContentState.createFromText(unhtmlplaintext)
    const existingeditorstate = EditorState.createWithContent(existingcontentstate)
    this.setState({
      activeItem: this.state.activeItem,
      editing: true,
      editorState: existingeditorstate,
    })
  }

  saveTitleChange(e) {
    e.preventDefault()
    console.log('ACTIVE ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = `http://localhost:8000/api/task-update/${this.state.activeItem.id}/`
    this.setState({
      editing: false
    })

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      console.log(this.state.editing)
    }).catch(function (error) {
      console.log('ERROR: ', error)
    })
  }


  deleteItem(task) {
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://localhost:8000/api/task-delete/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((response) => {
      this.fetchTasks()
    })
  }

  strikeUnstrike(task) {
    task.completed = !task.completed

    var csrftoken = this.getCookie('csrftoken')
    var url = `http://localhost:8000/api/task-update/${task.id}/`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'completed': task.completed, 'title': task.title })
    }).then(() => {
      this.fetchTasks()
    })

    console.log('Task striked-out: ', task.completed)
  }

  toggleCompleteTask() {

    var task = this.state.activeItem
    task.completed = !task.completed

    var csrftoken = this.getCookie('csrftoken')
    var url = `http://localhost:8000/api/task-update/${task.id}/`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'completed': task.completed, 'title': task.title })
    }).then(() => {
      this.fetchTasks()
      this.state.modalOpen = false
    })

    console.log('Task striked-out: ', task.completed)
  }

  renderAllTasks = () => {
    // Component which returns and renders the list of all tasks
    var tasks = this.state.todoList
    var self = this // Allows the function calls to reference "this" 

    return (
      // For each task in the todoList, assign the key to the todo index, print them all
      tasks.map(function (task, index) {
        return (
          <div key={index} className="task-wrapper flex-wrapper">

            <div style={{ flex: 7 }}
              onClick={() => self.strikeUnstrike(task)}>
              {task.completed == false ? (
                <span>☐ {task.title}</span>
              ) : (
                <span>☑ <strike> {task.title}</strike></span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => self.openModal(task)}>Focus</button>
            </div>

            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-dark delete"
                onClick={() => self.deleteItem(task)}>-</button>
            </div>

          </div>
        )
      })
    )
  }

  render() {
    const content = ContentState.createFromText(this.state.activeItem.description);

    return (
      <div className="container">
        <div id="task-container">

          <div id="form-wrapper">

            <form onSubmit={this.handleSubmit} id="form">

              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange}
                    className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="add task here">
                  </input>
                </div>

                <div style={{ flex: 1 }}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" ></input>
                </div>

              </div>
            </form>

          </div>

          <div id="list-wrapper">
            {
              this.renderAllTasks()
            }
          </div>

          <Modal
            isOpen={this.state.modalOpen}
            toggle={this.closeModal} // when background is clicked, close Modal
          >
            <ModalHeader>
              { // If state.editing=true, return form for new title, else return current title
                this.state.editing == false ? (
                  <span>{this.state.activeItem.title}</span>
                ) : (
                  <Form>
                    <Input onChange={this.handleChange} value={this.state.activeItem.title}></Input>
                  </Form>
                )
              }
            </ModalHeader>
            <ModalBody>
              { // If state.editing=true, return form for new description, else return current description
                this.state.editing == false ? (
                  <span dangerouslySetInnerHTML={{__html: this.state.activeItem.description}}></span>
                  // This is not secure, I'll need to come back and find a better way to surface the description text
                ) : (
                  <Form>
                    <Editor
                      // initialContentState={this.state.activeItem.contentState}
                      // editorContent={this.state.activeItem.contentState}
                      // onContentStateChange={this.handleChangeDesc}
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleChangeDesc}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                    />

                  </Form>
                )
              }

            </ModalBody>
            <ModalFooter>
              <Button onClick={this.toggleCompleteTask}>Complete Task</Button>
              { // If state.editing=true, return "Save edits" button, else return "Edit" button to begin edit
                this.state.editing == false ? (
                  // Start editing
                  <Button onClick={this.startTitleChange}>Edit</Button>
                ) : (
                  <Button onClick={this.saveTitleChange}>Save Changes</Button>
                )
              }
              <Button onClick={this.closeModal}>Close</Button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    )
  }
}

export default App;
