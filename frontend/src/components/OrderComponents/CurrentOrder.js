/*
    FILE: CurrentOrder.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: react, useCurOrderContext, usePrevOrderContext
*/

import { useState } from 'react'
import { useCurOrderContext } from '../../hooks/OrderContext/useCurOrderContext'
import { usePrevOrderContext } from '../../hooks/OrderContext/usePrevOrderContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const CurrentOrder = ({ order }) => {
    const [completed] = useState(true)
    const { dispatch } = useCurOrderContext()
    const { dispatch: prevDispatch} = usePrevOrderContext()
    const { user } = useAuthContext()

    const handleClickDel = async (event) => {
        event.preventDefault()
        const response = await fetch('/backend/order/delete/'+ order._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_ORDER', payload: json})
        }
    }

    const handleClickUp = async (event) => {
        event.preventDefault()
        const response = await fetch('/backend/order/update/'+ order._id, {
            method: 'PATCH',
            body: JSON.stringify({completed}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok){
            dispatch({type: 'DELETE_ORDER', payload: json})

            const responsePrev = await fetch('/backend/order/previous', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const jsonPrev = await responsePrev.json()
            prevDispatch({type: 'SHOW_ORDERS', payload: jsonPrev})
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="order">
            <h3>DATE: {formatDate(order.date)}</h3>
            <p>CONTENT: {order.content}</p>
            <p>STATUS: {order.completed ? 'Complete' : 'Pending'}</p>
            <button className='update' onClick={handleClickUp}>Mark as Complete</button>
            &nbsp;
            <button className='delete' onClick={handleClickDel}>Delete</button>
        </div>
    )
}

export default CurrentOrder