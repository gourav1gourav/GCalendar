import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Login = lazy(() => import('./component/login'));
const Home = lazy(() => import('./component/home'));
//const About = lazy(() => import('./component/About'));

export default Approuter = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/home" component={Home}/>
      </Switch>
    </Suspense>
  </Router>
);