/*
    FILE: SubscribedOrder.js [IN PROGRESS]
    AUTHORL jch-r
    DEPENDENCIES: usePrevOrderContext
*/

import { useEffect, useState } from 'react';
import { useSubscribedOrderContext } from "../../hooks/OrderContext/useSubscriberOrderContext";
import { useAuthContext } from '../../hooks/useAuthContext';

const SubscribedOrder = ({ order }) => {
    const { dispatch } = useSubscribedOrderContext();
    const { user } = useAuthContext();

    const handleClick = async (event) => {
        event.preventDefault();
        const response = await fetch('/backend/bank/unsubscribe/' + order.bank_id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UNSUBSCRIBE', payload: json });
            const responsePrev = await fetch('/backend/order/subscribed', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const jsonPrev = await responsePrev.json();

            if (responsePrev.ok) {
                dispatch({ type: 'SHOW_ORDERS', payload: jsonPrev });
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="order p-4 bg-white rounded-lg shadow-md mb-4">
            <div className="each">
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        DATE: {formatDate(order.date)}
                    </h3>
                    <p className="text-gray-600 mb-1">CONTENT: {order.content}</p>
                    <p className="text-gray-600">BANK: {order.bank_name}</p>
                </div>
                <button
                    onClick={handleClick}
                    className="unsub"
                >
                    Unsubscribe
                </button>
            </div>
        </div>
    );
};

export default SubscribedOrder;

