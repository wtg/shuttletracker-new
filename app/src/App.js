import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import LiveLocation from './pages/LiveLocation';
import Schedule from './pages/Schedule';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={ LiveLocation } />
          <Route path='/schedule' element={ Schedule } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
