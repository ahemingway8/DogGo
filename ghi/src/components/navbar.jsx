import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'

const Navbar = () => {
    const navigate = useNavigate()
    const { isLoggedIn, signout } = useAuthService()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

    const toggleMenu = () => setMenuOpen(!menuOpen)
    const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen)

    const handleLogout = async () => {
        await signout()
        navigate('/')
    }

    return (
        <>
            <nav className="bg-[#6F8B51] text-white fixed top-0 left-0 right-0 z-20">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">

                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-green-400 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>


                        {menuOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 shadow-md rounded-lg">
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            to="/places"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Places
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/events"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Events
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="text-xl font-bold">
                        <Link to="/" className="hover:text-green-400">DogGo</Link>
                    </div>


                    <div className="relative">
                        <button
                            onClick={toggleProfileDropdown}
                            className="flex items-center gap-2 text-white hover:text-green-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className={`w-5 h-5 transform transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-md rounded-lg">
                                <ul className="py-2">
                                    {!isLoggedIn ? (
                                        <>
                                            <li>
                                                <Link
                                                    to="/signin"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/signup"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    Sign Up
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setProfileDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>


            <div className="h-16"></div>
        </>
    )
}

export default Navbar
