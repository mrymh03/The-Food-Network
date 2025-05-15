/*
    FILE: Banks.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: usePrevOrderContext, react, PreviousOrder
*/
import { useBankContext } from '../hooks/useBankContext'
import { useAuthContext } from '../hooks/useAuthContext'

const Bank = ({ bank }) => {
    const { dispatch } = useBankContext()
    const { user } = useAuthContext()

    const handleClick = async (event) => {
        event.preventDefault()
        const response = await fetch('/backend/bank/subscribe/'+ bank._id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'SUBSCRIBE', payload: json})
        }
    }

    return (
        <div className="bank">
            <h3>BANK: {bank.title}</h3>
            <p>--- FOOD LIST: {bank.foodlist.toString()}</p>
            <p>--- DESCRIPTION: {bank.desc} </p>
            <button className='subscribe' onClick={handleClick}>subscribe</button>
        </div>
    )
}

export default Bank