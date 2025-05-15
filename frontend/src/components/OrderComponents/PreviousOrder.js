/*
    FILE: PreviousOrder.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: usePrevOrderContext
*/
import { usePrevOrderContext } from "../../hooks/OrderContext/usePrevOrderContext"
import { useAuthContext } from '../../hooks/useAuthContext'

const PreviousOrder = ({ order }) => {
    const { dispatch } = usePrevOrderContext()
    const { user } = useAuthContext()

    const handleClick = async (event) => {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };


    return (
        <div className="order">
            <h3>DATE: {formatDate(order.date)}</h3>
            <p>CONTENT: {order.content}</p>
            <p>STATUS: {order.completed ? 'Complete' : 'Incomplete'}</p>
            <button className='delete' onClick={handleClick}>delete</button>
        </div>
    )
}

export default PreviousOrder