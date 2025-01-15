import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from '../hooks/useAuthService';
import { useState } from 'react';
import defaultAvatar from '../assets/default-avatar.png';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthService();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => handleNavigation('/')}
                >
                    DogGO
                </div>
                <ul className="flex gap-4">
                    <li
                        className="cursor-pointer hover:text-gray-300 transition-colors"
                        onClick={() => handleNavigation('/places')}
                    >
                        Places
                    </li>
                    <li
                        className="cursor-pointer hover:text-gray-300 transition-colors"
                        onClick={() => handleNavigation('/events')}
                    >
                        Events
                    </li>
                    {isLoggedIn && (
                        <li
                            className="cursor-pointer hover:text-gray-300 transition-colors"
                            onClick={() => handleNavigation('/add-event')}
                        >
                            Add an Event
                        </li>
                    )}
                    {!isLoggedIn ? (
                        <>
                            <li
                                className="cursor-pointer hover:text-gray-300 transition-colors"
                                onClick={() => handleNavigation('/signup')}
                            >
                                Signup
                            </li>
                            <li
                                className="cursor-pointer hover:text-gray-300 transition-colors"
                                onClick={() => handleNavigation('signin')}
                            >
                                Login
                            </li>
                        </>
                    ) : (
                        <li className="relative">
                            <button
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={toggleDropdown}
                        >
                            <img
                                src={defaultAvatar}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span>Account</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg">
                                <ul>
                                    <li
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                                        onClick={logout}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
