import React from 'react';
import { useNavigagte } from 'react-router-dom';
import useAuthService from 'hooks/useAuthService';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuthService();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex jusitfy-between items-center">
                <div
                className="text-2xl font-bold cursor-pointer"
                onClick={}
            </div>
        </nav>
    )
