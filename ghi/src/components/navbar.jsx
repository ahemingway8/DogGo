import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'


const Navbar = () => {
    const navigate = useNavigate()
    const { isLoggedIn, logout } = useAuthService()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [hamburgerOpen, setHamburgerOpen] = useState(false)

    const toggleHamburger = () => setHamburgerOpen(!hamburgerOpen)
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

    const handleLogout = async () => {
        // Call your logout function, which could clear the token and perform any server-side logout logic
        await logout()
        navigate('/') // Redirect to homepage
    }

    return (
        <nav className="bg-gray-800 text-white fixed w-full z-10 top-0 left-0 shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo in the middle */}
                <div className="flex-1 text-center">
                    <Link to="/" className="text-xl font-bold">
                        Dog-Friendly
                    </Link>
                </div>

                {/* Hamburger Icon for Smaller Screens */}
                <button
                    onClick={toggleHamburger}
                    className="lg:hidden flex items-center justify-center text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Navigation Links */}
                <ul
                    className={`lg:flex space-x-6 lg:space-x-8 transition-all ${
                        hamburgerOpen ? 'block' : 'hidden'
                    }`}
                >
                    <li>
                        <Link to="/places" className="hover:text-green-400">
                            Places
                        </Link>
                    </li>
                    <li>
                        <Link to="/events" className="hover:text-green-400">
                            Events
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/event/create"
                                className="hover:text-green-400"
                            >
                                Add an Event
                            </Link>
                        </li>
                    )}

                    {/* Account Dropdown */}
                    <li className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 text-white hover:text-green-400"
                        >
                            <span>Account</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-md rounded-lg">
                                <ul className="space-y-2 p-3">
                                    {!isLoggedIn ? (
                                        <>
                                            <li>
                                                <Link
                                                    to="/signin"
                                                    className="block hover:bg-gray-100 p-2 rounded"
                                                >
                                                    Login
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/signup"
                                                    className="block hover:bg-gray-100 p-2 rounded"
                                                >
                                                    Sign Up
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left hover:bg-gray-100 p-2 rounded"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
