import { PrevOrderContext } from "../../context/OrderContext/PrevOrderContext";
import { useContext } from "react";

export const usePrevOrderContext = () => {
    const context = useContext(PrevOrderContext)
    if (!context) {
        throw Error()
    }

    return context
}