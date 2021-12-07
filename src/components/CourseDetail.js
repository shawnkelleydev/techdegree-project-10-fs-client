import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class CourseDetail extends Component {
  state = {
    courses: [],
    course: {},
  };

  componentDidMount() {
    this.getCourses();
  }

  //gets all courses and isolates current course data
  getCourses() {
    axios.get(`http://localhost:5000/api/courses`).then((res) => {
      this.setState({ courses: res.data });
      let courseId = window.location.href.split("/").splice(-1);
      courseId = parseInt(courseId);
      const course = this.state.courses.filter(
        (course) => course.id === courseId
      )[0];
      this.setState({ course });
    });
  }

  handleDelete(e) {
    e.preventDefault();

    const creds = {
      username: this.props.user.emailAddress,
      password: this.props.password,
    };
    if (this.state.course.userId === this.props.user.id) {
      const id = this.state.course.id;
      const url = `http://localhost:5000/api/courses/${id}`;
      axios.delete(url, { auth: creds }).then((res) => {
        if (res.status === 204) {
          alert("Course successfully deleted.");
        } else {
          alert(`Man down!  Course was not deleted.  Error: ${res.status}`);
        }
      });
    } else {
      alert("You are not authorized to delete this course.");
    }
  }

  render() {
    //get course id from url
    // let courseId = window.location.href.split("/").splice(-1);
    // courseId = parseInt(courseId);
    // const course = this.state.courses.filter(
    //   (course) => course.id === courseId
    // )[0];
    const course = this.state.course;
    // console.log(course.id);
    if (course.id) {
      const courseId = course.id;
      //handle materials
      let materials = course.materialsNeeded;
      if (materials) {
        if (materials.includes("*")) {
          materials = materials.split("*").filter((item) => item !== "");
        } else if (materials.includes(",")) {
          materials = materials.split(",").filter((item) => item !== "");
        } else if (materials.includes("\n")) {
          materials = materials.split("\n").filter((item) => item !== "");
        } else {
          materials = null;
        }
      }
      //handle description
      let description = course.description;
      description = description
        .split("\n")
        .filter((item) => item !== " " && item !== "");

      return (
        <main>
          <div className="actions--bar">
            <div className="wrap">
              <Link className="button" to={`/courses/${courseId}/update`}>
                Update Course
              </Link>
              <Link
                className="button"
                to="/"
                onClick={(e) => this.handleDelete(e)}
              >
                Delete Course
              </Link>
              <Link className="button button-secondary" to="/">
                Return to List
              </Link>
            </div>
          </div>
          <div className="wrap">
            <h2>Course Detail</h2>
            <form>
              <div className="main--flex">
                <div>
                  <h3 className="course--detail--title">Course</h3>
                  <h4 className="course--name">{course.title}</h4>
                  <p>By {course.user.firstName + " " + course.user.lastName}</p>
                  {description.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </div>
                <div>
                  <h3 className="course--detail--title">Estimated Time</h3>
                  <p>{course.estimatedTime ? course.estimatedTime : "none"}</p>
                  <h3 className="course--detail--title">Materials Needed</h3>
                  <ul className="course--detail--list">
                    {materials ? (
                      materials.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>no required materials</li>
                    )}
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </main>
      );
    } else {
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );
    }
  }
}

export default CourseDetail;
