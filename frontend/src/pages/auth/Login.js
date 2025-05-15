/*
    FILE: Login.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: N/A
*/
import { useState } from "react"
import { Link } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('consumer')
    const [error, setError] = useState(null)
    const [load, setLoad] = useState(false)
    const { dispatch } = useAuthContext()

    const loginHandle = async (event) => {
        event.preventDefault()

        setLoad(true)
        setError(null)

        const response = await fetch('/backend/auth/login',{
            method: 'POST',
            body: JSON.stringify({email,password,role}),
            headers: {'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if (!response.ok) {
            setLoad(false)
            setError(json.error)
        } else {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({type: 'LOGIN', payload: json})
            setLoad(false)
        }
    }

    return (
        <body>
            <div class= "navigation">
            <p class="logo">THE FOOD NETWORK</p>
            <Link to="/">
                <p class= "nav">About</p>
            </Link>
            </div>
        <form className="loginForm" onSubmit={loginHandle}>
            <h1>LOG IN:</h1>

            <label>Email:</label>
            <input 
            type="email"
            placeholder="example@example.com"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            />

            <label>Password:</label>
            <input 
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
            />

            <label>Role:</label>
            <select onChange={(event) => setRole(event.target.value)}
                value={role}>
                <option value="consumer">Consumer</option>
                <option value="fb">Food Bank</option>
            </select>
            <button disabled={load}>LOG IN</button>
            {error && <div className="error">{error}</div>}

            <Link to="/register">
                <h3>New User? Register!</h3>
            </Link>
        </form>
        </body>
    )
}

export default Login