import axios from "axios";
import { Routes, Route } from "react-router-dom";
import React, { Component } from "react";
import "../App.css";

//components
import Header from "./Header";
import Courses from "./Courses";
import CreateCourse from "./CreateCourse";
import UpdateCourse from "./UpdateCourse";
import CourseDetail from "./CourseDetail";
import UserSignIn from "./UserSignIn";
import UserSignUp from "./UserSignUp";
import UserSignOut from "./UserSignOut";

class App extends Component {
  state = {
    user: {},
    password: "",
  };

  /*
  
  As suggested in the project instructions, I'm letting components manage
  their own api calls / state.
  
  */

  handleCreateCourse(e) {
    e.preventDefault();
    const title = e.target.querySelector("#courseTitle").value;
    const description = e.target.querySelector("#courseDescription").value;
    const estimatedTime = e.target.querySelector("#estimatedTime").value;
    const materialsNeeded = e.target.querySelector("#materialsNeeded").value;
    const userId = this.state.user.id;
    const url = "http://localhost:5000/api/courses";
    const username = this.state.user.emailAddress;
    const password = this.state.password;
    console.log(username, password);
    const body = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    };
    const auth = {
      username,
      password,
    };

    axios.post(url, body, { auth }).then((res) => console.log(res));
  }

  handleNewUser(e) {
    e.preventDefault();
    const firstName = e.target.querySelector("#firstName").value;
    const lastName = e.target.querySelector("#lastName").value;
    const emailAddress = e.target.querySelector("#emailAddress").value;
    const password = e.target.querySelector("#password").value;
    const data = {
      firstName,
      lastName,
      emailAddress,
      password,
    };
    const url = "http://localhost:5000/api/users";
    axios.post(url, data).then((res) => console.log(res));
  }

  async handleSignIn(e) {
    e.preventDefault();
    const emailField = e.target.querySelector("#emailAddress");
    const passwordField = e.target.querySelector("#password");
    const email = emailField.value;
    const password = passwordField.value;
    this.setState({ password });
    const auth = {
      username: email,
      password,
    };
    // emailField.value = "";
    // passwordField.value = "";
    const url = "http://localhost:5000/api/users";
    axios.get(url, { auth }).then((res) => {
      this.setState({ user: res.data.user });
    });
    // this.setState({
    //   username: res.data.user.emailAddress,
    //   password: res.data.user. }));
  }

  handleSignOut(e) {
    e.preventDefault();
    this.setState({ user: {} });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route
            path="/courses/create"
            element={
              <CreateCourse
                submit={(e) => this.handleCreateCourse(e)}
                user={this.state.user}
              />
            }
          />
          <Route
            path="/courses/:id/update"
            element={
              <UpdateCourse
                user={this.state.user}
                password={this.state.password}
              />
            }
          />
          <Route
            path="/courses/:id"
            element={
              <CourseDetail
                user={this.state.user}
                password={this.state.password}
              />
            }
          />
          <Route
            path="signin"
            element={
              <UserSignIn
                submit={(e) => this.handleSignIn(e)}
                user={this.state.user}
                signout={(e) => this.handleSignOut(e)}
              />
            }
          />
          <Route
            path="signup"
            element={<UserSignUp submit={(e) => this.handleNewUser(e)} />}
          />
          <Route path="signout" element={<UserSignOut />} />
        </Routes>
      </div>
    );
  }
}

export default App;
