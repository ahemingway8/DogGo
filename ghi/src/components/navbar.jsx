import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'
import { useToast } from './toast'

const Navbar = () => {
    const navigate = useNavigate()
    const { isLoggedIn, signout } = useAuthService()
    const { Toast, showToast } = useToast()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

    const handleMenuMouseEnter = () => setMenuOpen(true)
    const handleMenuMouseLeave = (e) => {
        setTimeout(() => {
            if (!document.querySelector('.menu-dropdown:hover')) {
                setMenuOpen(false)
            }
        }, 100)
    }

    const handleProfileMouseEnter = () => setProfileDropdownOpen(true)
    const handleProfileMouseLeave = (e) => {
        setTimeout(() => {
            if (!document.querySelector('.profile-dropdown:hover')) {
                setProfileDropdownOpen(false)
            }
        }, 100)
    }

    const handleLogout = async () => {
        try {
            await signout()
            showToast('Successfully logged out')
            setTimeout(() => {
                navigate('/')
            }, 500)
        } catch (error) {
            console.error('Logout error', error)
            showToast('Error logging out')
        }
    }


    return (
        <>
            <nav className="bg-green text-white fixed top-0 left-0 right-0 z-20">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <div
                        className="relative"
                        onMouseEnter={handleMenuMouseEnter}
                        onMouseLeave={handleMenuMouseLeave}
                    >
                        <button
                            className="text-white hover:text-tan focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeMiterlimit="10" strokeWidth="3" d="M36.1,7.5h2.4c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2H18">
                            </path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeMiterlimit="10" strokeWidth="3" d="M13,14.5H9.5c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h21.3">
                            </path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeMiterlimit="10" strokeWidth="3" d="M13.3,27.5H9.5c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h20">
                            </path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeMiterlimit="10" strokeWidth="3" d="M35,20.5h3.5c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2h-20">
                            </path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
                            strokeWidth="3" d="M13.5,40.5h-4c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h19.6">
                            </path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
                            strokeWidth="3" d="M34.2,33.5h4.3c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2h-20">
                            </path>
                            </svg>
                        </button>

                        {menuOpen && (
                            <div
                                className="menu-dropdown absolute left-0 mt-2 w-48 bg-green text-white shadow-md rounded-lg"
                                onMouseLeave={handleMenuMouseLeave}
                            >
                                <ul className="py-2">
                                    <li>
                                        <Link
                                            to="/places"
                                            className="block px-4 py-2 hover:bg-light-green"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Places
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/events"
                                            className="block px-4 py-2 hover:bg-light-green"
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
                        <Link to="/" className="hover:text-tan">DogGo!</Link>
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={handleProfileMouseEnter}
                        onMouseLeave={handleProfileMouseLeave}
                    >
                        <button
                            className="flex items-center gap-2 text-white hover:text-tan"
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
                            <div
                                className="profile-dropdown absolute right-0 mt-2 w-48 bg-green text-white shadow-md rounded-lg"
                                onMouseLeave={handleProfileMouseLeave}
                            >
                                <ul className="py-2">
                                    {!isLoggedIn ? (
                                        <>
                                            <li>
                                                <Link
                                                    to="/signin"
                                                    className="block px-4 py-2 hover:bg-light-green"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/signup"
                                                    className="block px-4 py-2 hover:bg-light-green"
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
                                                className="block w-full text-left px-4 py-2 hover:bg-light-green"
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
            {Toast}
        </>
    )
}

export default Navbar
