/*
    FILE: CurrentOrders.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: usePrevOrderContext, react, CurrentOrder
*/

import { useEffect } from 'react'
import CurrentOrder from './CurrentOrder'
import { useCurOrderContext } from '../../hooks/OrderContext/useCurOrderContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const CurrentOrders = () => {
    const {orders, dispatch} = useCurOrderContext()
    const { user } = useAuthContext()

    //Upon render, get all orders that have not been completed
    useEffect(() => {
        const current = async () => {
            const response = await fetch('/backend/order/current', {
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
        <div className="currentOrders">
            {orders && orders.map(order => (
                    <CurrentOrder key={order._id} order={order}/>
                ))}
        </div>
    )
}

export default CurrentOrders