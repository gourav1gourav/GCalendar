import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import './App.css';
import * as serviceWorker from './serviceWorker';
import {Login} from './component/login';
import {Home}  from './component/home';
//const About = lazy(() => import('./component/About'));

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/home" component={Home}/>
      </Switch>
    </Suspense>
  </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
