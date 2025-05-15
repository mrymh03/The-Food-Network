/*
    FILE: Register.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: react
*/
import { useState } from "react"
import { Link } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"


const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('consumer')
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')
    const [error, setError] = useState(null)
    const [load, setLoad] = useState(false)
    const { dispatch } = useAuthContext()

    const registerHandle = async (event) => {
        event.preventDefault()

        setLoad(true)
        setError(null)

        const response = await fetch('/backend/auth/register', {
            method: 'POST',
            body: JSON.stringify({email,password,role,title,address,city,state,zip}),
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
        {role == "fb" ? 
            <form className="registerForm" onSubmit={registerHandle}>
            <h1>REGISTER:</h1>

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
            <select 
                onChange={(event) => setRole(event.target.value)}
                value={role}>
                <option value="consumer">Consumer</option>
                <option value="fb">Food Bank</option>
            </select>

            <label>Food Bank Title:</label>
            <input 
                type="title"
                onChange={event => setTitle(event.target.value)}
                value={title}
            />

            <label>Address:</label>
            <input 
                type="address"
                onChange={event => setAddress(event.target.value)}
                value={address}
            />

            <label>City:</label>
            <input 
                type="city"
                onChange={event => setCity(event.target.value)}
                value={city}
            />

            <label>State:</label>
            <input 
                type="state"
                onChange={event => setState(event.target.value)}
                value={state}
            />

            <label>Zip Code:</label>
            <input 
                type="zip"
                onChange={event => setZip(event.target.value)}
                value={zip}
            />
            <button disabled={load}>SIGN UP</button>
            {error && <div className="error">{error}</div>}

            <Link to="/login">
                <h3>Already have an account? Login!</h3>
            </Link>
        </form>
        : 
        <form className="registerForm" onSubmit={registerHandle}>
            <h1>REGISTER:</h1>

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
            <select 
                onChange={(event) => setRole(event.target.value)}
                value={role}>
                <option value="consumer">Consumer</option>
                <option value="fb">Food Bank</option>
            </select>
            <button disabled={load}>SIGN UP</button>
            {error && <div className="error">{error}</div>}

            <Link to="/login">
                <h3>Already have an account? Login!</h3>
            </Link>
        </form>
        }
        </body>
    )
}

export default Register