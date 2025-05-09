import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router';
import './App.css';
import LiveLocation from './pages/LiveLocation';
import Schedule from './pages/Schedule';

function App() {
  return (
    <Router>
      <header>
        <span className='title'>SHUBBLE</span>
        <nav className='big'>
          <ul>
            <li>
              <Link to='/about'>
                <span className="big">About</span>
              </Link>
            </li>
            <li>
              <Link to='/'>
                <span className='big'>Live Location</span>
              </Link>
            </li>
            <li className='schedule'>
              <Link to='/schedule'>
                <span className='big'>Schedule</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="App">
        <Routes>
          <Route path='/' element={ <LiveLocation /> } />
          <Route path='/schedule' element={ <Schedule /> } />
        </Routes>
      </div>
      <footer>
        <nav className='small'>
          <ul>
            <li>
              <Link to='/about'>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 512 512"><path fill="#444" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m26.714 128c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"/></svg>
              </Link>
            </li>
            <li>
              <Link to='/'>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20"><path fill="#444" d="M8.53 3.012q.233-.016.47-.016a7 7 0 0 1 6.984 7.474a.5.5 0 1 0 .998.066q.018-.267.018-.54a8 8 0 0 0-8.536-7.982a.5.5 0 1 0 .066.998M8 4.984a.5.5 0 0 1 .522-.479a6.25 6.25 0 0 1 5.972 5.973a.5.5 0 1 1-.999.043A5.25 5.25 0 0 0 8.48 5.505A.5.5 0 0 1 8 4.984M6.039 16.397l1.11 1.102a.5.5 0 0 0 .704 0l1.135-1.127l1.696-1.689a4.502 4.502 0 1 0-6.367 0c.408.408 1.116 1.113 1.722 1.714M7.5 12.621a1.125 1.125 0 1 1 0-2.25a1.125 1.125 0 0 1 0 2.25"/></svg>
              </Link>
            </li>
            <li>
              <Link to='/schedule'>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#444" d="M13 11.6V8q0-.425-.288-.712T12 7t-.712.288T11 8v3.975q0 .2.075.388t.225.337l3.3 3.3q.275.275.7.275T16 16t.275-.7t-.275-.7zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </Router>
  );
}

export default App;
