import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ErrorNotification from './components/ErrorNotification'
import './App.css'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

function App() {
    const [error, setError] = useState(null)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4">
                <header className="App-header">{/* <Nav /> */}</header>
                <Outlet />
                <ErrorNotification error={error} />
            </div>
        </div>
    )
}

export default App
