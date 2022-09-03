import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";
import Home from "./components/Home"
import Login from "./components/Login"

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Login />}
        </Route>
        <Route path="/login">{!user ? <Login /> : <Redirect to="/" />}</Route>
      </Switch>
    </Router>
  );
};

export default App;
