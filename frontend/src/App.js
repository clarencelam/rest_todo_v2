import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    }

    // This line gives us access to "this" method within fetchTasks function
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  // Function to listen for change events
  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  // Component to handle TODO item submissions
  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)
  }

  render() {
    var tasks = this.state.todoList

    return (
      <div className="container">
        <div id="task-container">

          <div id="form-wrapper">

            <form onSubmit={this.handleSubmit} id="form">

              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input onChange={this.handleChange}
                  className="form-control" id="title" type="text" name="title" placeholder="add task here">
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
              // For each task in the todoList, assign the key to the todo index, print them all
              tasks.map(function (task, index) {
                return (
                  <div key={index} className="task-wrapper flex-wrapper">

                    <div style={{ flex: 7 }}>
                      <span>{task.title}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <button className="btn btn-sm btn-outline-info">Edit</button>
                    </div>

                    <div style={{ flex: 1 }}>
                      <button className="btn btn-sm btn-outline-dark delete">-</button>
                    </div>


                  </div>
                )
              })}
          </div>

        </div>
      </div>
    )
  }
}

export default App;
