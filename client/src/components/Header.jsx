import React, {
    useState,
} from 'react';
import { Link } from 'react-router';
import '../styles/Header.css';

export default function Header() {

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
            </div>
        </header>
    );
}
