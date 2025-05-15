/*
    FILE: SearchBar.js [COMPLETE]
    AUTHOR: jch-r
*/

import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useBankContext } from '../hooks/useBankContext'
import Bank from './Banks'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchTermAddress, setSearchTermAddress] = useState('')
    const [searchTermCity, setSearchTermCity] = useState('')
    const [searchTermState, setSearchTermState] = useState('')
    const [category, setCategory] = useState('food')
    const {banks, dispatch} = useBankContext()
    const { user } = useAuthContext()

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (category == "title") {
            const response = await fetch('/backend/bank/searchTitle?searchTerm='+ searchTerm, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        else if (category == "location") {
            const response = await fetch('/backend/bank/searchLocation?' + new URLSearchParams({
                searchAddress: searchTermAddress,
                searchCity: searchTermCity,
                searchState: searchTermState,
            }).toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        else {
            const response = await fetch('/backend/bank/searchFood?searchTerm='+ searchTerm, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_BANKS', payload: json})}
        }
        
    }

    return (
        <div className="search">
            {category == ("title") ? 
                <form onSubmit={handleSubmit}>
                <label>CATEGORY: {category}</label>
                    <select 
                        onChange={(event) => setCategory(event.target.value)}
                        value={category}>
                        <option value="food">Food Item</option>
                        <option value="location">Food Bank Location</option>
                        <option value="title">Food Bank Name</option>
                    </select>
                    <label>SEARCH:</label>
                    <input
                        type="text"
                        placeholder="ex. bread, rice, meat, etc."
                        onChange={event => setSearchTerm(event.target.value)}
                        value={searchTerm}
                    />
                    <button>SEARCH</button>
                </form>
            : category == "food" ? 
                <form onSubmit={handleSubmit}>
                <label>CATEGORY: {category}</label>
                    <select 
                        onChange={(event) => setCategory(event.target.value)}
                        value={category}>
                        <option value="food">Food Item</option>
                        <option value="location">Food Bank Location</option>
                        <option value="title">Food Bank Name</option>
                    </select>
                    <label>SEARCH:</label>
                    <input
                        type="text"
                        placeholder="ex. bread, rice, meat, etc."
                        onChange={event => setSearchTerm(event.target.value)}
                        value={searchTerm}
                    />
                    <button>SEARCH</button>
                </form>
                :
                <form onSubmit={handleSubmit}>
                <label>CATEGORY:  {category}</label>
                    <select 
                        onChange={(event) => setCategory(event.target.value)}
                        value={category}>
                        <option value="food">Food Item</option>
                        <option value="location">Food Bank Location</option>
                        <option value="title">Food Bank Name</option>
                    </select>
                    <label>STREET ADDRESS:</label>
                    <input
                        type="text"
                        onChange={event => setSearchTermAddress(event.target.value)}
                        value={searchTermAddress}
                    />
                    <label>CITY:</label>
                    <input
                        type="text"
                        onChange={event => setSearchTermCity(event.target.value)}
                        value={searchTermCity}
                    />
                    <label>STATE:</label>
                    <input
                        type="text"
                        onChange={event => setSearchTermState(event.target.value)}
                        value={searchTermState}
                    />
                    <button>SEARCH</button>
                </form>
            }
            <div className="bankResults">
                {banks && banks.map((bank) => (
                    <Bank key={bank._id} bank={bank}/>
                ))}
            </div>
        </div>
    )
}

export default SearchBar