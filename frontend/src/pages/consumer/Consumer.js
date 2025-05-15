/*
    FILE: Consumer.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: NavBarCD
*/
import NavBarCD from '../../components/NavBarCD'
import MapComponent from '../../components/Map'
import SubscribedOrders from '../../components/OrderComponents/SubscribedOrders'
import SubscribedBanks from '../../components/SubscribedBanks'; 

const ConsumerPage = () => {
    return (
        <div className="consumer">
            <NavBarCD />
            <h1>CONSUMER</h1>
            <h2>MAP</h2>
            <MapComponent />
            <div className="subscriptions-container">
                <div className="subscribed-orders">
                    <h2>SUBSCRIBED ORDERS</h2>
                    <SubscribedOrders />
                </div>
                <div className="subscribed-banks">
                    <h2>SUBSCRIBED BANKS</h2>
                    <SubscribedBanks />
                </div>
            </div>
        </div>
    )
}

export default ConsumerPage