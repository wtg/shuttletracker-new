import React, {
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { LuMenu } from "react-icons/lu";

function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className='header'>
            <div className='header-top'>
                <div className='title'>
                    <h1>
                        SHUBBLE
                    </h1>
                </div>
                <button className='menu-button' onClick={toggleMenu}>
                    <LuMenu className='menu-icon' />
                </button>
            </div>
            { isOpen && (
                <nav className='nav'>
                    <Link to="/">Live Location</Link>
                    <Link to="/schedule">Schedule</Link>
                </nav>
            )}
        </header>
    );
}

export default Header;
