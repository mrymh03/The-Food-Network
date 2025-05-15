/*
    FILE: SubscribedOrders.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: usePrevOrderContext, react, PreviousOrder
*/
import { useEffect } from 'react';
import SubscribedOrder from './SubscribedOrder';
import { useSubscribedOrderContext } from '../../hooks/OrderContext/useSubscriberOrderContext';
import { useAuthContext } from '../../hooks/useAuthContext';

const SubscribedOrders = () => {
    const { orders, dispatch } = useSubscribedOrderContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/backend/order/subscribed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await response.json();

                if (response.ok) {
                    dispatch({ type: 'SHOW_ORDERS', payload: json });
                }
            } catch (error) {
                console.error("Error fetching subscribed orders:", error);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, dispatch]);

useEffect(() => {
    console.log('Subscribed Orders:', orders); 
}, [orders]);

    return (
        <div className="subscribed-orders-container">
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <SubscribedOrder key={order._id} order={order} />
                ))
            ) : (
                <p>No subscribed orders found.</p>
            )}
        </div>
    );
};

export default SubscribedOrders;
