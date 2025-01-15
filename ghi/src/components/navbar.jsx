import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'


const Navbar = () => {
    const navigate = useNavigate()
    const { isLoggedIn, logout } = useAuthService()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

    const handleLogout = async () => {
        // Call your logout function, which could clear the token and perform any server-side logout logic
        await logout()
        navigate('/') // Redirect to homepage
    }

    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-xl font-bold">
                    <Link to="/">Dog-Friendly</Link>
                </div>

                <ul className="flex space-x-6">
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

                    <li className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 text-white hover:text-green-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className={`w-5 h-5 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
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

export default Navbar;
