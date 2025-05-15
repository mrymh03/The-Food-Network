/*
    FILE: NavBarFB.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: react-router-dom
*/
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const NavBarFB = () => {
    const { dispatch } = useAuthContext()

    const handleClick = () => {
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
    }

    return (
        <header>
            <div className="container">
                <h2>THE FOOD NETWORK</h2>
                <Link to="/foodbank/home">
                    <h2>Home</h2>
                </Link>
                <Link to="/foodbank/management">
                    <h2>New Order</h2>
                </Link>
                <Link to="/foodbank/profile">
                    <h2>Profile</h2>
                </Link>
                <nav>
                    <button onClick={handleClick}>LOGOUT</button>
                </nav>
            </div>
        </header>
    )
}

export default NavBarFB