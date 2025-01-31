import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthService from '../hooks/useAuthService'
import { useToast } from './toast'
import AnimatedDogLogo from './AnimatedDogLogo'

const Navbar = () => {
    const navigate = useNavigate()
    const { isLoggedIn, signout } = useAuthService()
    const { Toast, showToast } = useToast()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [subMenuOpen, setSubMenuOpen] = useState(false)

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

    const toggleSubMenu = () => setSubMenuOpen(prevState => !prevState)

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
                <div className="flex justify-between items-center py-4 px-3">
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
                                className="h-7 w-7 mt-1"
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
                                    {isLoggedIn && (
                                        <li className="relative"
                                            onMouseEnter={() => setSubMenuOpen(true)}
                                            onMouseLeave={() => {
                                                setTimeout(() => {
                                                    if (!document.querySelector('.sub-menu-dropdown:hover')) {
                                                        setSubMenuOpen(false)
                                                    }
                                                }, 100)
                                            }}
                                        >
                                            <div className="block w-full px-4 py-2 hover:bg-light-green flex items-center justify-between">
                                                Events
                                                <span className={`ml-2 transform transition-transform ${subMenuOpen ? 'rotate-180' : ''}`}>
                                                    <svg
                                                        className="h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M6 9l6 6 6-6"></path>
                                                    </svg>
                                                </span>
                                            </div>

                                            {subMenuOpen && (
                                                <div className="sub-menu-dropdown absolute left-full top-0 w-48 bg-light-green text-white shadow-md rounded-lg"
                                                    onMouseLeave={() => {
                                                        setTimeout(() => {
                                                            if (!document.querySelector('.events-item:hover')) {
                                                                setSubMenuOpen(false)
                                                            }
                                                        }, 100)
                                                    }}
                                                >
                                                    <ul className="py-2">
                                                        <li>
                                                            <Link
                                                                to="/events"
                                                                className="block px-4 py-2 hover:bg-green"
                                                                onClick={() => setMenuOpen(false)}
                                                            >
                                                                All Events
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/my-events"
                                                                className="block px-4 py-2 hover:bg-green"
                                                                onClick={() => setMenuOpen(false)}
                                                            >
                                                                My Events
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    )}
                                    {!isLoggedIn && (
                                         <li>
                                            <Link
                                                to="/events"
                                                className="block px-4 py-2 hover:bg-light-green"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Events
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="text-3xl font-heading font-bold">
                        <Link to="/" className="flex items-center gap-2 hover:text-tan logo-container">
                            <AnimatedDogLogo />
                            <span className="mt-2">DogGo!</span>
                        </Link>
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={handleProfileMouseEnter}
                        onMouseLeave={handleProfileMouseLeave}
                    >
                        <button className="flex items-center gap-2 text-white hover:text-tan">
                            <svg viewBox="0 0 256 256" className="w-7 h-7 -mt-1">
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
