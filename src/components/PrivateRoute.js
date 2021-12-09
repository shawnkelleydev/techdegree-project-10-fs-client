import CreateCourse from "./CreateCourse";
import UpdateCourse from "./UpdateCourse";
import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {
  console.log("private", props.user.id);
  if (props.user.id) {
    return <CreateCourse user={props.user} password={props.password} />;
  } else {
    return <Navigate to="/signin" replace={true} />;
  }
};

export default PrivateRoute;
