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
    const handleMenuMouseLeave = () => {
        setTimeout(() => {
            if (!document.querySelector('.menu-dropdown:hover')) {
                setMenuOpen(false)
            }
        }, 100)
    }

    const handleProfileMouseEnter = () => setProfileDropdownOpen(true)
    const handleProfileMouseLeave = () => {
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
            <nav className="bg-green text-xl text-white fixed top-0 left-0 right-0 z-20 border-green p-1">
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
                            <svg
                                className="h-10 w-10 mt-1"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="25"
                                height="25"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M36.1,7.5h2.4c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2H18"
                                ></path>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M13,14.5H9.5c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h21.3"
                                ></path>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M13.3,27.5H9.5c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h20"
                                ></path>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M35,20.5h3.5c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2h-20"
                                ></path>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M13.5,40.5h-4c-1.1,0-2-0.9-2-2v-3c0-1.1,0.9-2,2-2h19.6"
                                ></path>
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="3"
                                    d="M34.2,33.5h4.3c1.1,0,2,0.9,2,2v3c0,1.1-0.9,2-2,2h-20"
                                ></path>
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

                    <div className="text-4xl font-heading font-bold">
                        <Link to="/" className="flex items-center gap-2 hover:text-tan">
                            <svg
                                className="h-14 w-14 -mt-3"
                                viewBox="0,0,256,256"
                            >
                                <g transform="scale(2,2)">
                                    <path d="M124,55h-14c0,-7.3 -6,-13.2 -13.2,-13.1l-9.5,0.1v0c-0.1,-2.7 -2.3,-4.8 -5,-4.8c-8.3,0 -15.1,6.7 -15.1,15v9.7c0,5.6 4.5,10.1 10.1,10.1v0v0v0h-34.8c-8.2,0 -16.1,3.3 -21.8,9.1v0c-5.5,6 -6.6,14.4 -8.5,23.1l-2.8,13c-0.7,3.5 1.9,6.8 5.5,6.8c2.5,0 4.8,-1.7 5.4,-4.2c0.5,-1.8 1,-3.7 1.2,-4.2c0.9,-2.3 2.2,-4.4 3.6,-6.3l5.4,11.7c0.8,1.8 2.7,3 4.7,3c3.4,0 5.9,-3.2 5,-6.5l-4.2,-16.4c3.2,-1.3 6.6,-2.1 10.2,-2.1h0.6c11.4,0 21.3,6.9 25.5,17c0.3,0.8 0.8,2.5 1.1,4c0.6,2.3 2.7,4 5.1,4c3,0 5.3,-2.5 5.2,-5.5c-0.2,-4.8 -0.4,-12.2 0.2,-19.5v0h9.1c2.7,0 5.3,0.9 7.5,2.5c0.7,0.6 1.4,1.2 2,1.9c1.4,1.4 3.6,2 5.7,1.3c3.5,-1.2 4.7,-5.1 2.7,-8.3c-3.2,-5.2 -8.9,-8.4 -15,-8.4h-10.3c1.4,-5.4 3.6,-9.7 7.1,-11.3c11.8,-5.6 31.3,6.6 31.3,-16.3c0,-0.2 0,-0.3 0,-0.5c0,-2.9 0,-4.9 0,-4.9z" fill="#f3f3f3" />
                                    <path d="M127,55c0,-1.7 -1.3,-3 -3,-3h-11.3c0,-0.1 0,-0.1 0,-0.2v-0.1c-0.1,-0.5 -0.2,-0.9 -0.4,-1.4v-0.1c-0.8,-2.5 -2.1,-4.8 -4,-6.6c-3,-3 -7.1,-4.6 -11.3,-4.6c-0.1,0 -7.3,0 -7.3,0c-1.3,-2.8 -4.1,-4.8 -7.4,-4.8c-9.9,0 -18,8.1 -18.1,18v9.7c0,3.5 1.3,6.8 3.8,9.3c2.5,2.5 5.8,3.8 9.3,3.8v0c6.2,0 11.4,-4.4 12.7,-10.2c1,0.4 2.2,0.7 3.3,0.7h0.1c3,0 5.8,-1.5 7.5,-4l1.5,-2.2c0.6,-0.8 1.5,-1.3 2.5,-1.3h5.1h11c0,0.6 0,1.2 0,1.9v0.5c0,4.7 -0.9,7.9 -2.6,9.6c-2.4,2.4 -7.1,2.2 -12.1,2.1c-5,-0.1 -10.2,-0.3 -14.9,1.9c-10.6,5 -11.7,27.1 -10.8,44.7c0,0.6 -0.2,1.2 -0.6,1.6c-0.4,0.4 -1,0.7 -1.6,0.7c-1,0 -1.9,-0.7 -2.1,-1.7c-0.7,-2.9 -1.1,-3.9 -1.3,-4.5c-4.7,-11.4 -15.8,-18.8 -28.2,-18.8h-0.6c-12.1,0 -22.9,7.3 -27.4,18.5c-0.1,0.3 -0.4,0.9 -1.3,4.6c-0.3,1.1 -1.3,1.9 -2.5,1.9c-1.1,0 -1.7,-0.6 -2,-1c-0.3,-0.4 -0.7,-1.1 -0.5,-2.2l2.8,-13c0.2,-1 0.4,-2 0.6,-3c1.5,-7.2 2.9,-14 7.2,-18.7c1.1,-1.2 1,-3.1 -0.2,-4.2c-1.2,-1.1 -3.1,-1 -4.2,0.2c-5.4,6 -7,13.5 -8.6,21.6c-0.2,1 -0.4,1.9 -0.6,2.9l-2.8,13c-0.5,2.6 0.1,5.2 1.7,7.2c1.6,2 4.1,3.2 6.7,3.2c3.9,0 7.3,-2.6 8.3,-6.4c0.8,-3.1 1.1,-3.8 1.1,-3.9c3.6,-9 12.2,-14.7 21.9,-14.7h0.6c10,0 18.9,5.9 22.7,15.1c0.1,0.3 0.4,1.1 1,3.6c0.9,3.7 4.2,6.3 8,6.3c2.2,0 4.4,-0.9 5.9,-2.6c1.5,-1.6 2.4,-3.8 2.2,-6.1c-1.3,-21.3 1.6,-36.3 7.2,-38.9c3.3,-1.6 7.8,-1.4 12.1,-1.3c6,0.2 12.2,0.3 16.4,-3.8c3,-2.9 4.4,-7.5 4.4,-13.9v-0.5c0.1,-2.9 0.1,-4.9 0.1,-4.9z" fill="#d9c4a9" />
                                    <path d="M97.9,85c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3c4,0 7.7,2.1 9.7,5.5c1,1.6 0.3,3.1 0,3.6c-0.3,0.5 -1.2,1.8 -3.1,1.8c-1.2,0 -2.3,-0.6 -3,-1.5c-1,-1.3 -2.8,-1.7 -4.2,-0.7c-1.3,1 -1.7,2.8 -0.7,4.2c1.8,2.5 4.7,4 7.8,4c3.5,0 6.6,-1.8 8.4,-4.8c1.7,-3 1.7,-6.6 -0.1,-9.7c-3.1,-5.1 -8.8,-8.4 -14.8,-8.4zM41.8,111.3c-0.4,-1.6 -2,-2.6 -3.7,-2.2c-1.6,0.4 -2.6,2 -2.2,3.7l1.8,7.1c0.1,0.4 -0.1,0.6 -0.2,0.8c-0.1,0.2 -0.1,0.3 -0.5,0.3c-1.7,0 -3,1.3 -3,3c0,1.7 1.3,3 3,3c2.1,0 4.1,-1 5.4,-2.7c1.3,-1.7 1.8,-3.9 1.2,-5.9zM29.7,75v0c1.2,0 2.4,0.7 2.9,1.9c1,2.3 2.9,4.3 5.4,5.4c1.4,0.6 2.8,0.9 4.3,0.9c2.9,0 5.6,-1.2 7.7,-3.4l2,-2.1c1.5,-1.6 3.7,-2.6 5.9,-2.6v0c1.6,0 3.1,-1.2 3.2,-2.8c0.1,-1.7 -1.3,-3.2 -3,-3.2h-28.4c-5.9,0 -11.2,-3.5 -13.5,-9l-5.4,-13.1c-0.6,-1.3 -2,-2.2 -3.4,-1.9c-1.9,0.4 -2.9,2.4 -2.2,4.1l5.5,13.2c3.2,7.6 10.7,12.6 19,12.6z" fill="#d9c4a9" />
                                    <path d="M97,49c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3z" fill="#ffffff" />
                                </g>
                            </svg>
                            <span className="mt-2">DogGo!</span>
                        </Link>
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={handleProfileMouseEnter}
                        onMouseLeave={handleProfileMouseLeave}
                    >
                        <button className="flex items-center gap-2 text-white hover:text-tan">
                            <svg viewBox="0 0 256 256" className="w-10 h-10 -mt-1">
                                <g transform="scale(5.33333,5.33333)" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" fill="none">
                                    <path
                                        d="M38.8,35c-3.4,4.5-8.8,7.5-14.8,7.5c-10.2,0-18.5-8.3-18.5-18.5c0-2.1,0.4-4.1,1-6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12.4,9.6c3.2-2.6,7.2-4.1,11.6-4.1c10.2,0,18.5,8.3,18.5,18.5c0,1.2-0.1,2.4-0.3,3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="24"
                                        cy="18"
                                        r="4.5"
                                    />
                                    <path
                                        d="M32.5,30.3c0-1.6-1.3-2.8-2.8-2.8h-11.4c-1.6,0-2.8,1.3-2.8,2.8v0c0,2.7,3.4,5.2,8.5,5.2c5.1,0,8.5-2.5,8.5-5.2z"
                                    />
                                </g>
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
                                                    onClick={() =>
                                                        setProfileDropdownOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Login
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/signup"
                                                    className="block px-4 py-2 hover:bg-light-green"
                                                    onClick={() =>
                                                        setProfileDropdownOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Sign Up
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button
                                                onClick={() => {
                                                    handleLogout()
                                                    setProfileDropdownOpen(
                                                        false
                                                    )
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
