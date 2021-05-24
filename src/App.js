import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import { CreateEventPage, HomePage, Page404 } from "./pages";
import { Header } from "./components";

import { eventsReducer } from "./state/reducers";

import { setEvents } from "./state/actions/events";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function App() {
  const classes = useStyles();

  const [events, dispatch] = React.useReducer(eventsReducer, []);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const events = localStorage.getItem("events");
    if (events && events.length > 0) {
      dispatch(setEvents(JSON.parse(events)));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route exact path="/">
            <HomePage events={events} dispatch={dispatch} />
          </Route>
          <Route exact path="/create-event/:id?">
            <CreateEventPage dispatch={dispatch} events={events} />
          </Route>
          <Route path="/404" component={Page404} />
          <Redirect to="/404" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
