import React, { Component } from 'react';
import './App.css';
import { Greeting } from './components/Greeting.js';
import { FocusModal } from './components/Modal.js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
      showDone: false,
    }

    // This line gives us access to "this" method within fetchTasks function
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)

    this.closeModal = this.closeModal.bind(this)

    this.toggleCompleteTask = this.toggleCompleteTask.bind(this)

    this.handleChangeDesc = this.handleChangeDesc.bind(this)
    this.hideDone = this.hideDone.bind(this)
    this.toggleShowDone = this.toggleShowDone.bind(this)

  };

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
  handleChangeDesc(e) {
    var value = e.target.value

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        description: value,
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
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
          description: '',
        },
        modalOpen: false,
        editing: false,
      });
    })

    console.log('Task striked-out: ', task.completed)
  }

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
    });
    this.fetchTasks();
  }

  toggleShowDone() {
    this.setState({
      showDone: !this.state.showDone,
    })
    console.log("toggled showDone to: ", this.state.showDone);
    this.hideDone()
  }

  hideDone() {
    // if this.state.showDone === false, hide the done section
    var doneItems = document.getElementById("done-wrapper");
    var doneContainer = document.getElementById("done-container")
    var showDone = this.state.showDone;

    if (showDone === false) {
      // hide Done section
      doneItems.style.position = "relative";
      doneItems.style.visibility = "hidden";
      doneItems.style.opacity = "0";
      doneItems.style.transform = "translateY(-100%)";
      // remove container color & boxshadow
      doneContainer.style.backgroundColor = "transparent";
      doneContainer.style.boxShadow = "none";

    } else {
      // show Done section
      doneItems.style.position = "relative";
      doneItems.style.visibility = "visible";
      doneItems.style.opacity = "1";
      doneItems.style.transform = "translateY(0%)";

      // re-add container color & boxshadow
      doneContainer.style.backgroundColor = "white";
      doneContainer.style.boxShadow = "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)"

    }
  }

  renderOpenTasks() {
    var self = this // Allows the function calls to reference "this" 
    var openTasks = this.state.todoList.filter(task => task.completed === false)
    return (
      openTasks = openTasks.map(function (task, index) {
        return (
          <div key={index} className="task-wrapper flex-wrapper">

            <div style={{ flex: 7 }}
              onClick={() => self.strikeUnstrike(task)}>
              <span>☐ {index + 1}. {task.title}</span>
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

  renderClosedTasks() {
    var self = this // Allows the function calls to reference "this" 
    var openTasks = this.state.todoList.filter(task => task.completed === true)
    return (
      openTasks = openTasks.map(function (task, index) {
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

            <div style={{ flex: 2 }}>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => self.strikeUnstrike(task)}>Re-open</button>
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

    return (
      <div className="container">

        <div id="header-container">
          <div id="header-wrapper">
            {<Greeting />}
          </div>
        </div>

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
            {this.renderOpenTasks()}
          </div>

          <FocusModal
            isOpen={this.state.modalOpen}
            toggle={this.closeModal}
            toggleComplete={this.toggleCompleteTask}
            onChange={this.handleChange}
            onDescChange={this.handleChangeDesc}
            getCookies={this.getCookie}
            todoItem={this.state.activeItem}
            className="Modal"
          />



        </div>

        <div id="done-container">
          <div id="done-header">
            <div></div>
            <button
              className="btn btn-sm btn-outline-info"
              id="toggleDone"
              onClick={this.toggleShowDone}
            >{this.state.showDone ? "⇈ DONE ⇈" : "⇊ DONE ⇊"}</button>
            <div></div>
            <button
              className="btn btn-sm btn-outline-info"
            >Clear all done</button>
            <div></div>
          </div>
          
          <div id="done-wrapper">
            {this.renderClosedTasks()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;

  // // new function to handle changes with the editorState
  // handleChangeDesc = editorState => {
  //   const contentState = editorState.getCurrentContent();

  //   console.log('editorState:', editorState)
  //   console.log('contentState in JSON', JSON.stringify(convertToRaw(contentState)))


  //   this.setState({
  //     editorState,
  //     activeItem: {
  //       ...this.state.activeItem,
  //       description: convertToHTML(contentState)
  //     }
  //   })
  // }


/* Save Title function
  saveTitleChange() {

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
*/

/* <Modal
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
                  <span dangerouslySetInnerHTML={{ __html: this.state.activeItem.description }}></span>
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
          </Modal> */
