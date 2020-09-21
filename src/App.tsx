import 'bootstrap/dist/css/bootstrap.min.css';
import React ,{lazy}from 'react';
import './App.css';
const Approuter = lazy(() => import('./route'));
//import{Approuter} from './route';

function App() {
  return (
    <div className="App">
      <Approuter/>
    </div>
  );
}

export default App;
