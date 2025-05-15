/*
    FILE: SubscribedBanks.js [COMPLETE]
    AUTHOR: jch-r
*/

import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Bank from './Banks';  

const SubscribedBanks = () => {
    const { user } = useAuthContext();
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchSubscribedBanks = async () => {
            try {
                const response = await fetch('/backend/bank/subscribed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setBanks(data);
                } else {
                    throw new Error('fail');
                }
            } catch (error) {
                console.error("fail", error);
            }
        };

        if (user) {
            fetchSubscribedBanks();
        }
    }, [user]);

    return (
        <div className="subscribed-banks-container">
            {banks.length > 0 ? (
                banks.map(bank => (
                    <Bank key={bank._id} bank={bank} isSubscribed={true} />
                ))
            ) : (
                <p>No subscribed banks found.</p>
            )}
        </div>
    );
};

export default SubscribedBanks;
