/*
    FILE: FoodBankProfileManagement.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: NavBarFB, react
*/
import { useState } from 'react'
import NavBarFB from '../../components/NavBarFB'
import { useAuthContext } from '../../hooks/useAuthContext'

const FoodBankProfileManagement = () => {
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')
    const [foodlist, setFoodlist] = useState('')
    const [desc, setDesc] = useState('')
    const [error, setError] = useState(null)
    const [loading, isLoading] = useState(false)
    const { user } = useAuthContext()

    const defaultAll = () => {
        setTitle('')
        setAddress('')
        setCity('')
        setState('')
        setZip('')
        setFoodlist('')
        setDesc('')
        setError(null)
        isLoading(false)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        isLoading(true)

        const update = { title, address, city, state, zip, foodlist, desc }
        const response = await fetch('/backend/bank/profile/', {
            method: 'PATCH',
            body: JSON.stringify(update),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        if (!response.ok) {
            setError(json.error)
            isLoading(false)
        }
        else {
            defaultAll()
        }
    }


    return (
        <div className="foodbankprofile">
            <NavBarFB />
            <form className="updateProfile" onSubmit={handleSubmit}>
                <h2>UPDATE PROFILE:</h2>
                <label>Title:</label>
                <input 
                    type="text"
                    onChange={event => setTitle(event.target.value)}
                    value={title}
                />
                <label>Address:</label>
                <input 
                    type="text"
                    onChange={event => setAddress(event.target.value)}
                    value={address}
                />
                <label>City:</label>
                <input 
                    type="text"
                    onChange={event => setCity(event.target.value)}
                    value={city}
                />
                <label>State:</label>
                <input 
                    type="text"
                    onChange={event => setState(event.target.value)}
                    value={state}
                />
                <label>Zip:</label>
                <input 
                    type="text"
                    onChange={event => setZip(event.target.value)}
                    value={zip}
                />
                <label>Food List:</label>
                <input 
                    type="text"
                    onChange={event => setFoodlist(event.target.value)}
                    value={foodlist}
                />
                <label>Description:</label>
                <textarea class="des"
                    type="text"
                    onChange={event => setDesc(event.target.value)}
                    value={desc}
                ></textarea>
                <button disabled={loading}>UPDATE</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default FoodBankProfileManagement