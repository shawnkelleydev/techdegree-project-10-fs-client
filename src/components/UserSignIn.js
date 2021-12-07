import { Link } from "react-router-dom";

const UserSignIn = (props) => {
  const user = props.user;
  console.log(user.id);
  if (!user.id) {
    return (
      <main>
        <div className="form--centered">
          <h2>Sign In</h2>
          <form onSubmit={props.submit}>
            <label htmlFor="emailAddress">Email Address</label>
            <input id="emailAddress" name="emailAddress" type="email" />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />

            <button className="button" type="submit">
              Sign In
            </button>

            <Link to="/">
              <button className="button button-secondary">Cancel</button>
            </Link>
          </form>
          <p>
            Don't have a user account? Click here to{" "}
            <Link to="/signup">sign up</Link>!
          </p>
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <div className="form--centered">
          <h2>Welcome back, {user.firstName}!</h2>
          <button className="button" onClick={props.signout}>
            Sign Out
          </button>
        </div>
      </main>
    );
  }
};

export default UserSignIn;
