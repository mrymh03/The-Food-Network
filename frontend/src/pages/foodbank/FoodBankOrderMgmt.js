/*
    FILE: FoodBankOrderManagement.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: NavBarFB, react, OrderObject
*/
import { useState } from 'react'
import NavBarFB from '../../components/NavBarFB'
import { useAuthContext } from '../../hooks/useAuthContext'

const FoodBankOrderManagement = () => {
    const [date, setDate] = useState('')
    const [content, setContent] = useState('')
    const [completed, setComplete] = useState(false)
    const [error, setError] = useState(null)
    const [loading, isLoading] = useState(false)
    const { user } = useAuthContext()

    const defaultAll = () => {
        setDate('')
        setContent('')
        setError(null)
        isLoading(false)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        isLoading(true)

        const order = { date, content, completed }
        const response = await fetch('/backend/order/create', {
            method: 'POST',
            body: JSON.stringify(order),
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
            const send = date + ": " + content
            const response = await fetch('/backend/order/getemails?searchTerm=' + send, {
                method: 'GET',
                headers: {
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
    }


    return (
        <div className="foodbankorders">
            <NavBarFB />
            <form className="createOrder" onSubmit={handleSubmit}>
                <h2>ADD ORDER:</h2>
                <label>DATE:</label>
                <input 
                    type="date"
                    onChange={event => setDate(event.target.value)}
                    value={date}
                />
                <label>CONTENT:</label>
                <input 
                    type="text"
                    onChange={event => setContent(event.target.value)}
                    value={content}
                />
                <label>DELIVERED:</label>
                <input 
                    className="completed"
                    type="checkbox"
                    onChange={event => setComplete(!completed)}
                    value={completed}
                />

                <button disabled={loading}>ADD ORDER</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default FoodBankOrderManagement