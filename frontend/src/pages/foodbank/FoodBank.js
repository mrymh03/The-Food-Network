/*
    FILE: FoodBank.js [COMPLETED]
    AUTHOR: jch-r
    DEPENDENCIES: NavBarFB, react, OrderObject
*/
import NavBarFB from '../../components/NavBarFB'
import CurrentOrders from '../../components/OrderComponents/CurrentOrders'
import PreviousOrders from '../../components/OrderComponents/PreviousOrders'

const FoodBank = () => {
    return (
        <div className="foodbank">
            <NavBarFB />
            <h1>Upcoming Orders:</h1>
            <CurrentOrders />
            <h1>Previous Orders:</h1>
            <PreviousOrders />
        </div>
    )
}

export default FoodBank