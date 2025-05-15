/*
    FILE: NavBarCD.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: react-router-dom
*/
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const NavBarCD = () => {
    const { dispatch } = useAuthContext()

    const handleClick = () => {
        localStorage.removeItem('user')
        dispatch({type: 'LOGOUT'})
    }

    return (
        <header>
            <div className="container">
                <h2>THE FOOD NETWORK</h2>
                <Link to="/consumer/home">
                    <h2>Home</h2>
                </Link>
                <Link to="/consumer/search">
                    <h2>Search</h2>
                </Link>
                <nav>
                    <button onClick={handleClick}>LOGOUT</button>
                </nav>
            </div>
        </header>
    )
}

export default NavBarCD