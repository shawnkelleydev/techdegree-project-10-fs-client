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
import PrivateRoute from "./PrivateRoute";

class App extends Component {
  state = {
    user: {},
    password: "",
    signOut: () => this.signOut(),
    signIn: () => this.signIn(),
  };

  /*
  
  As suggested in the project instructions, I'm letting components manage
  their own api calls / state.
  
  */
  componentDidMount() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      const auth = {
        username,
        password,
      };
      const url = "http://localhost:5000/api/users";
      axios
        .get(url, { auth })
        .then((res) => {
          this.setState({ user: res.data.user });
          this.setState({ password });
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  }

  handleNewUser(e) {
    e.preventDefault();
    let success = false;
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
    const valDiv = document.querySelector(".validation--errors");
    const valList = valDiv.querySelector("ul");
    valList.innerHTML = "";
    axios
      .post(url, data)
      .then((res) => {
        valDiv.style.display = "none";
        this.setState({ user: data, password });
        success = true;
      })
      .catch((err) => {
        valDiv.style.display = "block";

        const errors = err.response.data.errors;
        errors.forEach((error, i) => {
          valList.insertAdjacentHTML("beforeend", `<li key=${i}>${error}</li>`);
        });
      });
    return success;
  }

  signIn() {
    const emailField = document.querySelector("#emailAddress");
    const passwordField = document.querySelector("#password");
    const email = emailField.value;
    const password = passwordField.value;
    this.setState({ password });
    const auth = {
      username: email,
      password,
    };
    emailField.value = "";
    passwordField.value = "";
    const url = "http://localhost:5000/api/users";
    axios
      .get(url, { auth })
      .then((res) => {
        this.setState({ user: res.data.user });
        localStorage.setItem("username", email);
        localStorage.setItem("password", password);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }

  signOut() {
    this.setState({ user: {} });
    localStorage.clear();
  }

  render() {
    return (
      <div className="App">
        <Header user={this.state.user.firstName} />
        <Routes>
          <Route path="/" element={<Courses user={this.state.user} />} />
          <Route path="courses">
            <Route
              path=":id"
              element={
                <CourseDetail
                  user={this.state.user}
                  password={this.state.password}
                />
              }
            />
            <Route
              path=":id/update"
              element={
                <PrivateRoute
                  user={this.state.user}
                  password={this.state.password}
                  action="update"
                />
              }
            />
            <Route
              path="create"
              element={
                <PrivateRoute
                  user={this.state.user}
                  password={this.state.password}
                  action="create"
                />
              }
            />
          </Route>
          <Route
            path="signin"
            element={
              <UserSignIn
                submit={this.state.signIn}
                user={this.state.user}
                signout={this.state.signOut}
              />
            }
          />
          <Route
            path="signup"
            element={<UserSignUp submit={(e) => this.handleNewUser(e)} />}
          />
          <Route
            path="signout"
            element={<UserSignOut signOut={this.state.signOut} />}
          />
        </Routes>
      </div>
    );
  }
}

export default App;
