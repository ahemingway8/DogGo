import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ErrorNotification from './components/ErrorNotification'
import Navbar from './components/navbar'
import './App.css'


const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const [error, setError] = useState(null)

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-tan">
            <Navbar />
            <Outlet />
            <ErrorNotification error={error} />
        </div>
    )
}

export default App
