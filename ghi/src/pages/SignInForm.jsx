import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import useAuthService from '../hooks/useAuthService'

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { signin, user, error } = useAuthService()

    async function handleFormSubmit(e) {
        e.preventDefault()
        await signin({ username, password })
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/backroundDog.jpg')" }}
        >
            <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-sm bg-light-green bg-opacity-75 p-6 rounded-lg shadow-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-white">
                    Log In
                </h2>

                {error && (
                    <div className="text-black text-sm p-2 border border-red rounded bg-red">
                        {error.message}
                    </div>
                )}

                <div className="space-y-2">
                    <label
                        htmlFor="username"
                        className="block text-white font-medium"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="w-full px-4 py-2 border border-green rounded focus:outline-none focus:ring focus:ring-white"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-white font-medium"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full px-4 py-2 border border-green rounded focus:outline-none focus:ring focus:ring-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-white text-black font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-white"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}
