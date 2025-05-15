import { SubOrderContext } from "../../context/OrderContext/SubscribedOrderContext";
import { useContext } from "react";

export const useSubscribedOrderContext = () => {
    const context = useContext(SubOrderContext)
    if (!context) {
        throw Error()
    }

    return context
}