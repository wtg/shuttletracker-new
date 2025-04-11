import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Live Location</Link>
                </li>
                <li>
                    <Link to="/schedule">Schedule</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
