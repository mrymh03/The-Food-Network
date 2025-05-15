/*
    FILE: SubscribedBanksForMap.js [COMPLETE]
    AUTHOR: [REDACTED FOR PRIVACY]
*/
import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const MapSubBanks = () => {
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

    return banks;
};

export default MapSubBanks;
