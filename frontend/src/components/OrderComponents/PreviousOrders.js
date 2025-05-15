/*
    FILE: PreviousOrders.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: usePrevOrderContext, react, PreviousOrder
*/
import { useEffect } from 'react'
import PreviousOrder from './PreviousOrder'
import { usePrevOrderContext } from '../../hooks/OrderContext/usePrevOrderContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const PreviousOrders = () => {
    const { orders, dispatch } = usePrevOrderContext()
    const { user } = useAuthContext()

    //Upon render, get all orders that have not been completed
    useEffect(() => {
        const current = async () => {
            const response = await fetch('/backend/order/previous', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {dispatch({type: 'SHOW_ORDERS', payload: json})}
        }
        current()
    }, [dispatch])

    return (
            <div className="previousOrders">
                { orders && orders.map(order => (
                    <PreviousOrder key={order._id} order={order}/>
                ))}
            </div>
    )
}

export default PreviousOrders